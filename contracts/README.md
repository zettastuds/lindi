# contracts/ — Soroban smart contracts (placeholder)

Blockchain workstream lives here. **Not part of the TypeScript/Turborepo graph** — own Rust/cargo toolchain, same git repo.

When the blockchain team starts (you or a teammate), initialize per `docs/technical/SMART-CONTRACTS.md`:

```bash
# from repo root, after installing the Stellar toolchain (see docs PART A)
stellar contract init contracts --name lindi-core
cd contracts
cargo test
stellar contract build      # -> target/wasm32v1-none/release/lindi_core.wasm
```

Implements the Lindi Core contract: circle lifecycle, contributions, vault-as-circle
shares, governance→rebalance, default + unanimous early-exit penalty.

The live data layer that talks to these contracts goes in `packages/stellar`
(implements `LindiDataSource` from `@lindi/shared`). The mobile app stays on the
mock source until that lands — zero UI changes on swap.
