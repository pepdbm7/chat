interface IUser {
  id: string;
  username?: string;
  room?: string;
}

interface IReturned {
  user?: IUser;
  users?: IUser[];
  error?: string;
}

const users: IUser[] = [];

const addUser = ({ id = "", username = "", room = "" }: IUser): IReturned => {
  const user = { id, username, room };

  console.log("from addUser:", { id, username, room });

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUserInRoom = users.find(
    (user) => user.room === room && user.username === username
  );

  if (!username || !room)
    return { user, error: "Missing username or room name" };

  if (existingUserInRoom) return { user, error: "Username is already taken!" };

  users.push(user);

  return { user, error: "" };
};

const removeUser = (id: string): IReturned => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) users.splice(index, 1)[0];
  else return { error: "Couldn't remove user: not found!" };

  return { users };
};

const getUser = (id: string): IReturned => {
  const foundUser: IUser | undefined = users.find((user) => user.id === id);

  if (!foundUser) return { error: "User not found!" };

  return { user: foundUser };
};

const getUsersInRoom = (room: string): IUser[] =>
  users.filter((user) => user.room === room);

export { addUser, removeUser, getUser, getUsersInRoom };
