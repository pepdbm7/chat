interface IUser {
  id: string;
  username?: string;
  room?: string;
}

interface IAnswer {
  user?: IUser;
  users?: IUser[];
  error?: string;
}

const users: IUser[] = [];

const addUser = ({ id, username, room }: IUser): IAnswer => {
  const user = { id, username, room };

  console.log("NEW User:", { id, username, room });

  username = username?.trim().toLowerCase();
  room = room?.trim().toLowerCase();

  const existingUserInRoom = users.find(
    (user) => user.room === room && user.username === username
  );

  if (!username || !room)
    return { user, error: "Missing username or room name" };

  if (existingUserInRoom) return { user, error: "Username is already taken!" };

  users.push(user);

  return { user, error: "" };
};

const removeUser = (id: string): IAnswer | undefined => {
  const index: number = users.findIndex((user) => user.id === id);
  const removedUser: IUser = users.splice(index, 1)[0];

  console.log("desde RemoveUser:", { index }, { removedUser });

  if (index !== -1) return { user: removedUser };
};

const getUser = (id: string): IAnswer => {
  const foundUser: IUser | undefined = users.find((user) => user.id === id);

  if (!foundUser) return { error: "User not found!" };

  return { user: foundUser };
};

const getUsersInRoom = (room: string): IAnswer => {
  const usersInRoom: IUser[] = users.filter((user) => user.room === room);
  console.log("from getusersinroom:", { room }, { usersInRoom });
  return usersInRoom
    ? { users: usersInRoom }
    : { error: "No users in this room!" };
};

export { addUser, removeUser, getUser, getUsersInRoom };
