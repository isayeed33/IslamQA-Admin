import axios from "axios";
import MockAdapter from "axios-mock-adapter";

interface UserData {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

const mock = new MockAdapter(axios);

export function configureFakeBackend() {
  const users: UserData[] = [
    {
      id: 1,
      username: "admin@islamqa.info",
      password: "admin123",
      firstName: "Admin",
      lastName: "IslamQA",
      role: "Admin",
      // This is a long-lived JWT for development only
      token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI",
    },
    {
      id: 2,
      username: "editor@islamqa.info",
      password: "editor123",
      firstName: "Editor",
      lastName: "IslamQA",
      role: "Editor",
      token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI",
    },
  ];

  mock.onPost("/login/").reply((config) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const params = JSON.parse(config.data);
        const filteredUsers = users.filter(
          (u) => u.username === params.username && u.password === params.password
        );
        if (filteredUsers.length) {
          resolve([200, filteredUsers[0]]);
        } else {
          resolve([401, { message: "Username or password is incorrect" }]);
        }
      }, 500);
    });
  });

  mock.onPost("/logout/").reply(200, {});

  mock.onPost("/register/").reply((config) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const params = JSON.parse(config.data);
        const [firstName, lastName] = params.fullname.split(" ");
        const newUser: UserData = {
          id: users.length + 1,
          username: params.email,
          password: params.password,
          firstName,
          lastName: lastName || "",
          role: "Editor",
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI",
        };
        users.push(newUser);
        resolve([200, newUser]);
      }, 500);
    });
  });
}
