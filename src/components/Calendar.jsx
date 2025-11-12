import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import "./Calendar.css";

export default function Calendar({ readOnly = false }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "calendario"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(
        data.map((e) => ({
          title: e.evento,
          date: e.data,
        }))
      );
    };
    fetchEvents();
  }, []);

  const handleDateClick = (info) => {
    const today = new Date();
    const clickedDate = new Date(info.dateStr);

    if (readOnly) return;
    if (clickedDate < today.setHours(0, 0, 0, 0)) return;

    setSelectedDate(info.dateStr);
    setShowModal(true);
  };

  //Salvar evento
  const handleSave = async () => {
    if (!eventTitle.trim()) return;

    await addDoc(collection(db, "calendario"), {
      data: selectedDate,
      evento: eventTitle,
    });

    setEvents([...events, { title: eventTitle, date: selectedDate }]);
    setShowModal(false);
    setEventTitle("");
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-box">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
        />
      </div>

      {showModal && (
        <div className="calendar-overlay" onClick={() => setShowModal(false)}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Adicionar Evento</h2>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Digite o nome do evento"
            />
            <div className="calendar-modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                Salvar
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
