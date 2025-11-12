import React from "react";
import Layout from "../components/Layout.jsx";
import Calendar from "../components/Calendar.jsx";

export default function Calendario() {
  return (
    <Layout>
      <div className="calendar-page">
        <Calendar />
      </div>
    </Layout>
  );
}
