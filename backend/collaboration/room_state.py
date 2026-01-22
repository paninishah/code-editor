# room_state.py

# Global dictionary living in server memory
active_rooms = {}

def get_room(workspace_id):
    return active_rooms.get(workspace_id)

def create_room(workspace_id, owner_id, initial_code):
    active_rooms[workspace_id] = {
        "code": initial_code,
        "owner_id": owner_id,
        "session_active": True
    }

def update_code(workspace_id, new_code):
    active_rooms[workspace_id]["code"] = new_code

def end_session(workspace_id):
    active_rooms[workspace_id]["session_active"] = False
