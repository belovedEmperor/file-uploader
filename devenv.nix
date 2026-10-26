{pkgs, ...}: {
  packages = [pkgs.prisma-engines_7];

  services.postgres = {
    enable = true;
    port = 5432;
    listen_addresses = "localhost";
    initialDatabases = [
      {
        name = "files";
        user = "user";
        pass = "pass";
      }
    ];
    initialScript = "ALTER USER \"user\" WITH CREATEDB;";
  };
}
