import { prisma } from "../lib/prisma.js";
import fs from "node:fs";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 20 * 1000 * 1000, // MB
  },
});

export function fileCreateGet(req, res) {
  res.render("uploadForm");
}

export const fileCreatePost = [
  upload.array("files"),
  async (req, res) => {
    if (!req.files.length) {
      res.status(200).json({ error: "Upload request received no files." });
      return;
    }

    const filesData = req.files.map((file) => ({
      name: file.originalname,
      size: file.size,
      userId: req.user.id,
      path: file.path,
    }));

    await prisma.file.createMany({
      data: filesData,
      skipDuplicates: true,
    });

    res.redirect("/");
  },
];

export async function fileReadGet(req, res) {
  const file = await prisma.file.findUnique({
    where: { id: Number(req.params.id), userId: Number(req.user.id) },
  });
  if (!file) {
    return res.status(404).send("File not found.");
  }
  res.render("fileDetail", { file });
}

export function fileRenameGet(req, res) {
  res.render("nameForm", {
    title: "Rename File",
    action: `/file/${req.params.id}/rename`,
    buttonText: "Rename",
  });
}

export async function fileRenamePost(req, res) {
  await prisma.file.update({
    where: { id: Number(req.params.id), userId: req.user.id },
    data: { name: req.body.name },
  });
  res.redirect(`/file/${req.params.id}`);
}

export async function fileDeletePost(req, res) {
  const file = await prisma.file.delete({
    where: { id: Number(req.params.id), userId: req.user.id },
    select: { path: true },
  });
  await fs.promises.rm(file.path);
  res.redirect("/");
}

export async function fileMoveGet(req, res) {
  const folders = await prisma.folder.findMany({
    where: {
      userId: Number(req.user.id),
    },
  });

  if (!folders) {
    return res.status(404).send("Folder not found.");
  }

  res.render("moveFile", { fileId: req.params.id, folders });
}

export async function fileMovePost(req, res) {
  if (req.params.folderId === "0") {
    await prisma.file.update({
      where: { id: Number(req.params.id), userId: req.user.id },
      data: { folderId: null },
    });
    return res.redirect("/");
  }

  await prisma.file.update({
    where: { id: Number(req.params.id), userId: req.user.id },
    data: { folderId: Number(req.params.folderId) },
  });
  res.redirect(`/folder/${req.params.folderId}`);
}

export async function fileDownloadGet(req, res) {
  const file = await prisma.file.findUnique({
    where: { id: Number(req.params.id), userId: req.user.id },
    select: { path: true, name: true },
  });
  if (!file) {
    return res.status(404).send("File not found.");
  }
  res.download(file.path, file.name);
}
