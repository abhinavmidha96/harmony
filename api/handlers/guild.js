const db = require("../../models");
const { withTransaction, asyncMiddleware } = require("../../helpers/mongoose");

const createGuild = withTransaction(async (session, req, res) => {
  const { name, createdBy, categories } = req.body;

  const guild = await new db.Guild({ name, createdBy, categories }).save({
    session,
  });

  const populatedGuild = await guild.populate("createdBy").execPopulate();

  await new db.GuildMember({
    guild: guild._id,
    name: populatedGuild.createdBy.fullName,
  }).save({
    session,
  });

  return res.set({ Location: "TODO" }).status(201).json(guild);
});

const getGuild = asyncMiddleware(async (req, res) => {
  res.json(req.guild);
});

const createCategory = asyncMiddleware(async (req, res) => {
  const {
    guild,
    body: { name, channels },
  } = req;

  const categoriesCount = guild.categories.push({ name, channels });

  await guild.save();

  res
    .set({ Location: "TODO" })
    .status(201)
    .json(guild.categories[categoriesCount - 1]);
});

const getCategory = asyncMiddleware(async (req, res) => {
  const { guild } = req;

  const category = guild.categories.id(req.params.categoryId);

  res.json(category);
});

exports.createGuild = createGuild;
exports.getGuild = getGuild;
exports.createCategory = createCategory;
exports.getCategory = getCategory;
