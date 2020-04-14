interface IUser {
  id: string;
  username: string;
  room: string;
}

const users: IUser[] = [];

const addUser = ({ id = "", username = "", room = "" }): IUser | Error => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  if (!username || !room) throw new Error("Missing username or room name");

  if (existingUser) throw new Error("Username is already taken!");

  const user = { id, username, room };

  users.push(user);

  return user;
};

const removeUser = (id: string): IUser[] => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) users.splice(index, 1)[0];
  else throw new Error("Couldn't remove user: not found!");

  return users;
};

const getUser = (id: string): IUser | Error => {
  const foundUser: IUser | undefined = users.find((user) => user.id === id);

  if (!foundUser) throw new Error("User not found!");

  return foundUser;
};

const getUsersInRoom = (room: string): IUser[] =>
  users.filter((user) => user.room === room);

export { addUser, removeUser, getUser, getUsersInRoom };
