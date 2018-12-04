const server = require('./server');

class Room {
	constructor() {
		this.sessions = [];
	}

	broadcast(msg, owner) {
		//todo: check type for msg.

		this.sessions.forEach((session) => {
			if (owner != null && owner == session) {
				return;
			}

			session.send(msg);
		});
	}
}

class RoomManager {
	getRoom(roomKey) {
		let room = this.rooms[roomKey];
		logger.debug(`[RoomManager] getRoom(${roomKey})`);
		if (room == null) {
			return cb(new PError(PErrorType.ROOM_NOT_EXIST));
		}

		cb(null, room);
	}
}

server.open(port, (err, conn) => {
	conn.onConnected((session) => {

	});

	conn.onMsg((session, msg) => {
		if (msg.type = 'join') {
			roomMgr.getRoom(msg.roomId, (err, room) => {
				if (err) {
					return session.send(msg.id, err);
				}

				session.send(PMsg.JOINED_INTO_ROOM);
				session.room = room;
				//session.room.broadcast(PMsg.USER_JOIN);
				return;
			});
		}

		if (session.room == null) {
			return;
		}

		session.room.broadcast(msg);
	});

	conn.onDisconnected((session) => {
		logger.log(`${session.id} has disconnected.`);

		if (session.room) {
			return session.room.leave(session);
		}
	});
});

