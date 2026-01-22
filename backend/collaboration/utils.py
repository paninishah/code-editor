
# collaboration/utils.py

def is_owner(room, user):
    return room["owner_id"] == user.id


def session_active(room):
    return room["session_active"]
