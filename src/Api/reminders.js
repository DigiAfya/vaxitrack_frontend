import { api } from './api';

export const TEMP_REMINDERS_KEY = 'temporaryDashboardReminders';
export const DOSE_PROGRESS_KEY_PREFIX = 'profileDoseProgress';

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

const parseReminderDate = (value) => {
    const raw = String(value ?? '').trim();
    if (!raw) return null;

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed;
};

const parseDoseCount = (value) => {
    const asNumber = Number(value);

    if (Number.isFinite(asNumber) && asNumber > 0) {
        return Math.floor(asNumber);
    }

    const text = String(value ?? '').trim().toLowerCase();
    if (!text) return null;

    const match = text.match(/(\d+)/);
    if (!match) return null;

    const parsed = Number(match[1]);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null;
};

export const hasReminderDeadlinePassed = (value, now = new Date()) => {
    const raw = String(value ?? '').trim();
    const parsed = parseReminderDate(raw);

    if (!parsed) return false;

    if (raw.includes('T')) {
        return parsed.getTime() < now.getTime();
    }

    const endOfDueDay = new Date(
        parsed.getFullYear(),
        parsed.getMonth(),
        parsed.getDate(),
        23,
        59,
        59,
        999
    );

    return endOfDueDay.getTime() < now.getTime();
};

export const getEffectiveReminderStatus = (status, dueDate, now = new Date()) => {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === 'taken' || normalizedStatus === 'overdue') {
        return normalizedStatus;
    }

    return hasReminderDeadlinePassed(dueDate, now) ? 'overdue' : 'due';
};

export const withEffectiveReminderStatus = (item, now = new Date()) => {
    if (!item || typeof item !== 'object') {
        return item;
    }

    return {
        ...item,
        status: getEffectiveReminderStatus(item?.status, item?.dueDate, now),
    };
};

export const countRemindersByStatus = (items = [], now = new Date()) => {
    const source = Array.isArray(items) ? items : [];

    return source.reduce(
        (counts, item) => {
            const effectiveStatus = getEffectiveReminderStatus(item?.status, item?.dueDate, now);

            if (effectiveStatus === 'taken') counts.taken += 1;
            else if (effectiveStatus === 'overdue') counts.overdue += 1;
            else counts.due += 1;

            counts.total += 1;
            return counts;
        },
        { taken: 0, due: 0, overdue: 0, total: 0 }
    );
};

export const normalizeReminder = (item, source = 'api') => {
    if (!item || typeof item !== 'object') {
        return null;
    }

    const reminderId = Number(item.reminder_id ?? item.reminderId ?? item.id);
    const profileId = Number(item.profile_id ?? item.profileId);
    const vaccineId = Number(item.vaccine_id ?? item.vaccineId);

    const dueDate = String(item?.due_date ?? item?.dueDate ?? item?.start_time ?? item?.startTime ?? '');
    const totalDoses = parseDoseCount(
        item?.total_doses ??
        item?.totalDoses ??
        item?.dose_sequence ??
        item?.doses ??
        item?.Vaccine?.dose_sequence ??
        item?.Vaccine?.doses
    );
    const doseNumber = parseDoseCount(
        item?.dose_number ??
        item?.doseNumber ??
        item?.current_dose ??
        item?.currentDose
    );

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
        dueDate,
        status: getEffectiveReminderStatus(item?.status, dueDate),
        reminderType: normalizeReminderType(item?.reminderType ?? item?.type ?? item?.vaccineType ?? item?.category),
        totalDoses,
        doseNumber,
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

    const endpoints = [
        `/api/v1/reminders/${safeProfileId}`,
        `/api/reminders/${safeProfileId}`,
    ];

    const attempts = endpoints.flatMap((endpoint) => ([
        () => api.get(endpoint, {
            headers: {
                'X-Profile-Id': String(safeProfileId),
            },
        }),
        () => api.get(endpoint),
    ]));

    let response;
    let lastError;

    for (const attempt of attempts) {
        try {
            response = await attempt();
            break;
        } catch (error) {
            lastError = error;
        }
    }

    if (!response) {
        throw lastError ?? new Error('Unable to fetch reminders right now.');
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

export const updateProfileReminder = async (profileId, reminderId, payload) => {
    const safeReminderId = Number(reminderId);
    const safeProfileId = Number(profileId);

    if (!Number.isFinite(safeReminderId) || safeReminderId <= 0) {
        throw new Error('Invalid reminder id for reminder update request.');
    }

    const nextStartTime = String(payload?.dueDate ?? payload?.start_time ?? '').trim();
    if (!nextStartTime) {
        throw new Error('Invalid reminder date/time for reminder update request.');
    }

    const nextStatus = normalizeStatus(payload?.status);

    const requestBody = {
        start_time: nextStartTime,
        status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1),
    };

    const attempts = [
        () => api.put(`/api/reminders/${safeReminderId}`, requestBody),
        () => api.put(`/api/v1/reminders/${safeReminderId}`, requestBody),
        () => Number.isFinite(safeProfileId) && safeProfileId > 0
            ? api.put(`/api/v1/reminders/${safeProfileId}/${safeReminderId}`, requestBody, {
                headers: { 'X-Profile-Id': String(safeProfileId) },
            })
            : Promise.reject(new Error('Missing profile id for profile-scoped reminder endpoint.')),
    ];

    let lastError;

    for (const attempt of attempts) {
        try {
            const response = await attempt();
            return normalizeReminder(response?.data?.data ?? response, 'api');
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError ?? new Error('Unable to update reminder.');
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

export const updateTemporaryReminder = (profileId, reminderId, updates = {}) => {
    const safeProfileId = Number(profileId);

    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
        return null;
    }

    try {
        const saved = window.localStorage.getItem(TEMP_REMINDERS_KEY);
        const parsed = JSON.parse(saved ?? '[]');
        const safeList = Array.isArray(parsed) ? parsed : [];

        let updatedReminder = null;

        const nextList = safeList.map((item) => {
            const sameProfile = Number(item?.profileId) === safeProfileId;
            const sameId = String(item?.id ?? '') === String(reminderId ?? '');

            if (!sameProfile || !sameId) {
                return item;
            }

            const merged = {
                ...item,
                ...updates,
            };

            updatedReminder = normalizeReminder(merged, 'temporary');
            return updatedReminder ?? merged;
        });

        window.localStorage.setItem(TEMP_REMINDERS_KEY, JSON.stringify(nextList));
        return updatedReminder;
    } catch {
        return null;
    }
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

export const removeTemporaryReminder = (profileId, reminderId) => {
    const safeProfileId = Number(profileId);

    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
        return false;
    }

    try {
        const raw = window.localStorage.getItem(TEMP_REMINDERS_KEY);
        const parsed = JSON.parse(raw ?? '[]');

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return false;
        }

        const nextList = parsed.filter((item) => {
            const sameProfile = Number(item?.profileId) === safeProfileId;
            const sameId = String(item?.id ?? '') === String(reminderId ?? '');
            return !(sameProfile && sameId);
        });

        if (nextList.length !== parsed.length) {
            window.localStorage.setItem(TEMP_REMINDERS_KEY, JSON.stringify(nextList));
            return true;
        }

        return false;
    } catch {
        return false;
    }
};

export const deleteProfileReminder = async (profileId, reminder) => {
    const safeProfileId = Number(profileId);
    const safeReminderId = Number(reminder?.id ?? reminder?.reminderId ?? reminder?.reminder_id);

    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
        throw new Error('Invalid profile id for reminder delete request.');
    }

    if (reminder?.isTemporary) {
        const removed = removeTemporaryReminder(safeProfileId, reminder?.id);

        if (!removed) {
            throw new Error('Unable to remove temporary reminder.');
        }

        return { success: true, temporary: true };
    }

    if (!Number.isFinite(safeReminderId) || safeReminderId <= 0) {
        throw new Error('Invalid reminder id for reminder delete request.');
    }

    const attempts = [
        () => api.delete(`/api/reminders/${safeReminderId}`),
        () => api.delete(`/api/v1/reminders/${safeReminderId}`),
        () => api.delete(`/api/v1/reminders/${safeProfileId}/${safeReminderId}`, {
            headers: { 'X-Profile-Id': String(safeProfileId) },
        }),
    ];

    let lastError;

    for (const attempt of attempts) {
        try {
            await attempt();
            return { success: true, temporary: false };
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError ?? new Error('Unable to delete reminder.');
};

export const getDoseProgressItemKey = (item) => {
    const vaccineId = Number(item?.vaccineId ?? item?.vaccine_id ?? 0);

    if (Number.isFinite(vaccineId) && vaccineId > 0) {
        return `id:${vaccineId}`;
    }

    const vaccineName = String(item?.vaccineName ?? item?.name ?? item?.Vaccine?.name ?? '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    return vaccineName ? `name:${vaccineName}` : '';
};

export const getStoredDoseProgress = (profileId) => {
    const safeProfileId = Number(profileId);

    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(`${DOSE_PROGRESS_KEY_PREFIX}:${safeProfileId}`);
        const parsed = JSON.parse(raw ?? '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
};

export const updateStoredDoseProgress = (profileId, item, updater) => {
    const safeProfileId = Number(profileId);
    const progressKey = getDoseProgressItemKey(item);

    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0 || !progressKey || typeof updater !== 'function') {
        return null;
    }

    try {
        const currentMap = getStoredDoseProgress(safeProfileId);
        const currentValue = Math.max(0, Number(currentMap?.[progressKey]) || 0);
        const nextValueRaw = updater(currentValue);
        const nextValue = Math.max(0, Number(nextValueRaw) || 0);

        const nextMap = {
            ...currentMap,
            [progressKey]: nextValue,
        };

        window.localStorage.setItem(`${DOSE_PROGRESS_KEY_PREFIX}:${safeProfileId}`, JSON.stringify(nextMap));
        return nextValue;
    } catch {
        return null;
    }
};