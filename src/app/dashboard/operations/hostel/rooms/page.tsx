import React from "react";
import { getRooms, getHostels } from "./actions";
import ClientRooms from "./ClientRooms";

export default async function RoomsPage() {
  const roomsRes = await getRooms();
  const hostelsRes = await getHostels();

  const rooms = roomsRes.success ? roomsRes.data : [];
  const hostels = hostelsRes.success ? hostelsRes.data : [];

  // Need a default tenantId if not tied to session in this prototype, 
  // falling back to a dummy or grabbing from the first hostel if available.
  const tenantId = hostels.length > 0 ? hostels[0].tenantId : "user-tenant-123";

  return (
    <ClientRooms 
      initialRooms={rooms || []} 
      hostels={hostels || []} 
      tenantId={tenantId}
    />
  );
}
