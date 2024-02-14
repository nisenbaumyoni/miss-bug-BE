export async function getBugs(req, res) {
  try {
    const filterBy = {
      title: req.query.title || "",
      severity: req.query.severity,
      dateSort: req.query.dateSort,
      pageIndex: req.query.pageIndex,
    };
    const bugs = await bugService.query(filterBy);
    res.send(bugs);
  } catch (err) {
    res.status(400).send(`Couldn't get bugs`);
  }
}
