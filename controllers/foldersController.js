import { prisma } from "../lib/prisma.js";
import { body, validationResult, matchedData } from "express-validator";

export function folderCreateGet(req, res) {
  res.render("folderForm");
}

export async function folderCreatePost(req, res) {
  prisma.folder.create({ data: { name: req.body.name } });
  res.redirect("/");
}

export async function folderReadGet(req, res) {
  const folder = prisma.folder.findUnique({
    where: {
      id: req.param.id,
    },
    include: {
      files: true,
    },
  });
  res.render("files", { folder });
}

export async function folderRenameGet(req, res) {
  res.render("folderForm");
}

export async function folderRenamePost(req, res) {
  prisma.folder.update({
    where: { id: req.param.id },
    data: {
      name: req.body.name,
    },
  });
  res.redirect(`/folder/${req.param.id}`);
}

export async function folderDeletePost(req, res) {
  prisma.folder.delete({ where: { id: req.param.id } });
}
