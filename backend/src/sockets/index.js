// Real-time layer for live tracking. The REST controllers already emit into
// these rooms on status changes; this file just wires up the rooms clients
// can join and a couple of direct client -> client relay events (e.g. a
// mechanic pushing their live lat/lng while en route).
export function registerSockets(io) {
  io.on("connection", (socket) => {
    // A customer's tracking screen joins the booking's room to receive
    // status_changed / payment_settled events pushed from the controllers.
    socket.on("join_booking", (bookingId) => {
      if (bookingId) socket.join(String(bookingId));
    });

    // A mechanic's dashboard joins their own room to receive new_request
    // events the moment a customer creates a booking against them.
    socket.on("join_mechanic", (mechanicId) => {
      if (mechanicId) socket.join(`mechanic:${mechanicId}`);
    });

    // Mechanic's live GPS position while en route, relayed straight to the
    // customer tracking the same booking.
    socket.on("mechanic_location_update", ({ bookingId, lat, lng }) => {
      if (!bookingId) return;
      io.to(String(bookingId)).emit("mechanic_location", { lat, lng });
    });

    socket.on("disconnect", () => {
      // no-op: rooms are cleaned up automatically by socket.io
    });
  });
}
