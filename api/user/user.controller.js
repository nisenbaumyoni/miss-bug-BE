export async function getUsers(req, res) {
    try {
    //   const filterBy = {
    //     title: req.query.title || "",
    //     severity: req.query.severity,
    //     dateSort: req.query.dateSort,
    //     pageIndex: req.query.pageIndex,
    //   };
    //   const users = await userService.query(filterBy);
      res.send("<h1>hello getUsers</h1>");
    } catch (err) {
      res.status(400).send(`Couldn't get users`);
    }
  }

//   export const userController = {
//     getUsers
//   };
  