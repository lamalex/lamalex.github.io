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
            exec fish -c "source ./completions/generate-pdf.fish; echo 'Node '(node --version)' | npm '(npm --version); exec fish"
          '';
        };
      }
    );
}
