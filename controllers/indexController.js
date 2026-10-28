import { prisma } from "../lib/prisma.js";

export async function homeGet(req, res) {
  const folders = await prisma.folder.findMany({
    where: {
      userId: Number(req.user.id),
    },
  });
  const files = await prisma.file.findMany({
    where: {
      userId: Number(req.user.id),
      folderId: null,
    },
  });

  res.render("home", { folders, files });
}
