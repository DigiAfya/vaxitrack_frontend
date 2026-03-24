import { Navbar } from "../Navbar/Navbar";
import { DashHeader } from "./Dash-header/Dash-header";
import { DashBody } from "./Dash-body/DashBody";

export function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <DashHeader/>
      <DashBody />
    </div>
  );
}