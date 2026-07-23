{
  description = "Dev environment for lamalex.github.io";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            fish
          ];

          shellHook = ''
            export PATH="$PWD/scripts:$PATH"
            echo "Node $(node --version) | npm $(npm --version)"
          '';
        };
      }
    );
}
