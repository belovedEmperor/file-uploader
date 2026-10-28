import { prisma } from "../lib/prisma.js";
import { body, validationResult, matchedData } from "express-validator";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1000 * 1000 },
});

export function fileCreateGet(req, res) {
  res.render("uploadForm");
}

export const fileCreatePost = [
  upload.array("files"),
  async (req, res) => {
    if (!req.files.length)
      res.status(200).json({ error: "Upload request received no files." });

    const filesData = req.files.map((file) => ({
      name: file.originalname,
      size: file.size,
      userId: req.user.id,
    }));

    await prisma.file.createMany({
      data: filesData,
      skipDuplicates: true,
    });
  },
];

export function fileReadGet(req, res) {
  const file = prisma.file.findUnique({ where: { id: req.param.id } });
  res.render("fileDetail", { file });
}

export function fileRenameGet(req, res) {
  res.render("renameFileForm");
}

export async function fileRenamePost(req, res) {
  await prisma.file.update({
    where: { id: req.param.id },
    data: { name: req.body.name },
  });
  res.redirect(`/file/${req.param.id}`);
}

export async function fileDeletePost(req, res) {
  await prisma.file.delete({ where: { id: req.param.id } });
}
