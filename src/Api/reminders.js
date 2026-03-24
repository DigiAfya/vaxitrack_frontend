import { api } from './api';

export const TEMP_REMINDERS_KEY = 'temporaryDashboardReminders';

const normalizeStatus = (status) => {
    const value = String(status ?? '').trim().toLowerCase();

    if (value === 'taken') return 'taken';
    if (value === 'overdue') return 'overdue';
    return 'due';
};

const normalizeReminderType = (value) => {
    const text = String(value ?? '').trim().toLowerCase();

    if (text.includes('recommend') || text.includes('optional') || text.includes('not compulsory')) {
        return 'recommended';
    }

    return 'compulsory';
};

const toDateKey = (value) => {
    const text = String(value ?? '').trim();
    if (!text) return '';
    return text.includes('T') ? text.split('T')[0] : text.slice(0, 10);
};

const toReminderKey = (item) => {
    const vaccineId = Number(item?.vaccineId ?? item?.vaccine_id ?? 0) || 0;
    const dueDate = toDateKey(item?.dueDate ?? item?.due_date);

    if (vaccineId > 0) {
        return `id:${vaccineId}:${dueDate}`;
    }

    const vaccineName = String(item?.vaccineName ?? item?.name ?? item?.Vaccine?.name ?? '')
        .trim()
        .toLowerCase();

    return `name:${vaccineName}:${dueDate}`;
};

export const normalizeReminder = (item, source = 'api') => {
    if (!item || typeof item !== 'object') {
        return null;
    }

    const reminderId = Number(item.reminder_id ?? item.reminderId ?? item.id);
    const profileId = Number(item.profile_id ?? item.profileId);
    const vaccineId = Number(item.vaccine_id ?? item.vaccineId);

    return {
        id: Number.isFinite(reminderId) && reminderId > 0 ? reminderId : item.id ?? `temp-${Date.now()}`,
        profileId: Number.isFinite(profileId) && profileId > 0 ? profileId : null,
        vaccineId: Number.isFinite(vaccineId) && vaccineId > 0 ? vaccineId : null,
        vaccineName:
            item?.Vaccine?.name ??
            item?.vaccineName ??
            item?.name ??
            'Vaccine',
        ageRange: item?.Vaccine?.age_range ?? item?.ageRange ?? 'Vaccination reminder',
        dueDate: String(item?.due_date ?? item?.dueDate ?? ''),
        status: normalizeStatus(item?.status),
        reminderType: normalizeReminderType(item?.reminderType ?? item?.type ?? item?.vaccineType ?? item?.category),
        createdAt: String(item?.createdAt ?? item?.created_at ?? ''),
        isTemporary: source === 'temporary',
    };
};

const extractReminderArray = (payload) => {
    const source = payload?.data?.data ?? payload?.data ?? payload;

    if (Array.isArray(source)) return source;
    if (Array.isArray(source?.reminders)) return source.reminders;
    if (Array.isArray(source?.items)) return source.items;

    return [];
};

export const formatReminderApiDate = (value) => toDateKey(value);

export const fetchProfileReminders = async (profileId) => {
    const safeProfileId = Number(profileId);

    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
        throw new Error('Invalid profile id for reminders request.');
    }

    const endpoint = `/api/v1/reminders/${safeProfileId}`;
    let response;

    try {
        response = await api.get(endpoint, {
            headers: {
                'X-Profile-Id': String(safeProfileId),
            },
        });
    } catch (primaryError) {
        const primaryStatus = Number(primaryError?.response?.status);

        if (primaryStatus === 400 || primaryStatus === 500) {
            response = await api.get(endpoint);
        } else {
            throw primaryError;
        }
    }

    return extractReminderArray(response)
        .map((item) => normalizeReminder(item, 'api'))
        .filter(Boolean)
        .sort((left, right) => String(left?.dueDate ?? '').localeCompare(String(right?.dueDate ?? '')));
};

export const createProfileReminder = async (profileId, payload) => {
    const response = await api.post(`/api/v1/reminders/${profileId}`, {
        vaccine_id: payload.vaccineId,
        due_date: formatReminderApiDate(payload.dueDate),
        status: normalizeStatus(payload.status),
    }, {
        headers: {
            'X-Profile-Id': String(profileId),
        },
    });

    return normalizeReminder(response?.data?.data ?? response, 'api');
};

export const getTemporaryReminders = (profileId) => {
    const safeProfileId = Number(profileId);
    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(TEMP_REMINDERS_KEY);
        const parsed = JSON.parse(raw ?? '[]');

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter((item) => Number(item?.profileId) === safeProfileId)
            .map((item) => normalizeReminder(item, 'temporary'))
            .filter(Boolean)
            .sort((left, right) => String(left?.dueDate ?? '').localeCompare(String(right?.dueDate ?? '')));
    } catch {
        return [];
    }
};

export const saveTemporaryReminder = (entry) => {
    const normalizedEntry = normalizeReminder(entry, 'temporary');
    if (!normalizedEntry) {
        return null;
    }

    try {
        const saved = window.localStorage.getItem(TEMP_REMINDERS_KEY);
        const parsed = JSON.parse(saved ?? '[]');
        const safeList = Array.isArray(parsed) ? parsed : [];
        const nextList = [...safeList, normalizedEntry].slice(-100);
        window.localStorage.setItem(TEMP_REMINDERS_KEY, JSON.stringify(nextList));
    } catch {
        return normalizedEntry;
    }

    return normalizedEntry;
};

export const clearSyncedTemporaryReminders = (profileId, backendReminders) => {
    const safeProfileId = Number(profileId);
    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
        return;
    }

    const backendKeys = new Set(
        (Array.isArray(backendReminders) ? backendReminders : [])
            .map((item) => toReminderKey(item))
            .filter(Boolean)
    );

    if (backendKeys.size === 0) {
        return;
    }

    try {
        const raw = window.localStorage.getItem(TEMP_REMINDERS_KEY);
        const parsed = JSON.parse(raw ?? '[]');

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return;
        }

        const nextList = parsed.filter((item) => {
            if (Number(item?.profileId) !== safeProfileId) {
                return true;
            }

            return !backendKeys.has(toReminderKey(item));
        });

        if (nextList.length !== parsed.length) {
            window.localStorage.setItem(TEMP_REMINDERS_KEY, JSON.stringify(nextList));
        }
    } catch {
        return;
    }
};

export const mergeReminderLists = (backendReminders, temporaryReminders) => {
    const merged = [];
    const seen = new Set();

    [...(Array.isArray(backendReminders) ? backendReminders : []), ...(Array.isArray(temporaryReminders) ? temporaryReminders : [])]
        .forEach((item) => {
            const key = toReminderKey(item);

            if (!key || seen.has(key)) {
                return;
            }

            seen.add(key);
            merged.push(item);
        });

    return merged.sort((left, right) => String(left?.dueDate ?? '').localeCompare(String(right?.dueDate ?? '')));
};