import { prisma } from "../lib/prisma.js";
import fs from "node:fs";
import { body, validationResult, matchedData } from "express-validator";

export function folderCreateGet(req, res) {
  res.render("nameForm", {
    title: "New Folder",
    action: `/folder/new`,
    buttonText: "Create",
  });
}

export async function folderCreatePost(req, res) {
  await prisma.folder.create({
    data: { name: req.body.name, userId: req.user.id },
  });
  res.redirect("/");
}

export async function folderReadGet(req, res) {
  const folder = await prisma.folder.findUnique({
    where: { id: Number(req.params.id), userId: req.user.id },
    include: {
      files: true,
    },
  });
  if (!folder) {
    return res.status(404).send("Folder not found.");
  }
  res.render("folderContents", { folder });
}

export async function folderRenameGet(req, res) {
  res.render("nameForm", {
    title: "Rename Folder",
    action: `/folder/${req.params.id}/rename`,
    buttonText: "Rename",
  });
}

export async function folderRenamePost(req, res) {
  await prisma.folder.update({
    where: { id: Number(req.params.id), userId: req.user.id },
    data: {
      name: req.body.name,
    },
  });
  res.redirect(`/folder/${req.params.id}`);
}

export async function folderDeletePost(req, res) {
  const folder = await prisma.folder.delete({
    where: { id: Number(req.params.id), userId: req.user.id },
    include: { files: { select: { path: true } } },
  });
  await Promise.all(
    folder.files.map(async (file) => {
      await fs.promises.rm(file.path);
    }),
  );
  res.redirect("/");
}
