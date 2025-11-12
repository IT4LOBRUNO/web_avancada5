import React from "react";
import Layout from "../components/Layout.jsx";
import Calendar from "../components/Calendar.jsx";

export default function Datas() {
  return (
    <Layout>
      <div>
        <h1>Calendário de Eventos</h1>

        <Calendar readOnly={true} />
      </div>
    </Layout>
  );
}
