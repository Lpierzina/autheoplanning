flowchart TD

subgraph group_workflow["Agent workflow"]
  node_skill["/gm skill<br/>skill entry<br/>[SKILL.md]"]
  node_instructions["Execution instructions<br/>protocol docs<br/>[entry.md]"]
  node_spool["Execution spool<br/>filesystem queue"]
  node_fsm["Workflow state graph<br/>state machine data<br/>[graph.json]"]
  node_policies["Predicates and gates<br/>policy rules<br/>[predicates.md]"]
end

subgraph group_runtime["Execution runtime"]
  node_plugkit["gm-plugkit<br/>npm package<br/>[cli.js]"]
  node_wasm{{"rs-plugkit WASM<br/>Rust/WASM runtime"}}
  node_nativehost{{"agentplug host<br/>native host"}}
  node_memory[("Project memory<br/>SQLite database")]
  node_browser["Browser session config<br/>browser boundary"]
  node_indexdeps["Indexing plugins<br/>source submodules"]
end

subgraph group_distribution["Publishing and docs"]
  node_publish["npm publishing<br/>GitHub Actions workflow<br/>[publish.yml]"]
  node_docs["Docs deployment<br/>GitHub Actions workflow<br/>[gh-pages.yml]"]
  node_site["Flatspace docs site<br/>static site"]
end

node_package["gm-skill package<br/>npm package"]
node_installer["Installer<br/>Node entry point<br/>[install.js]"]
node_bootstrap["Bootstrap<br/>[bootstrap.js]"]

node_package -->|"installs"| node_installer
node_installer -->|"starts"| node_bootstrap
node_bootstrap -->|"installs"| node_skill
node_skill -->|"follows"| node_instructions
node_instructions -->|"uses"| node_spool
node_instructions -->|"defines workflow against"| node_fsm
node_fsm -->|"evaluates with"| node_policies
node_policies -.->|"gates dispatch"| node_spool
node_spool -->|"dispatches through"| node_wasm
node_plugkit -->|"loads pinned artifact"| node_wasm
node_wasm -->|"delegates side effects"| node_nativehost
node_nativehost -->|"reads and writes"| node_memory
node_nativehost -->|"drives Chrome CDP"| node_browser
node_indexdeps -.->|"supplies development capabilities"| node_wasm
node_publish -->|"publishes"| node_package
node_publish -->|"publishes"| node_plugkit
node_docs -->|"builds and deploys"| node_site

click node_installer "https://github.com/anentrypoint/gm/blob/main/bin/install.js"
click node_bootstrap "https://github.com/anentrypoint/gm/blob/main/bin/bootstrap.js"
click node_skill "https://github.com/anentrypoint/gm/blob/main/skills/gm/SKILL.md"
click node_instructions "https://github.com/anentrypoint/gm/blob/main/.gm/instructions/entry.md"
click node_fsm "https://github.com/anentrypoint/gm/blob/main/.gm/instructions/fsm/graph.json"
click node_policies "https://github.com/anentrypoint/gm/blob/main/.gm/instructions/fsm/predicates.md"
click node_plugkit "https://github.com/anentrypoint/gm/blob/main/gm-plugkit/cli.js"
click node_browser "https://github.com/anentrypoint/gm/blob/main/.gm/browser-config.json"
click node_publish "https://github.com/anentrypoint/gm/blob/main/.github/workflows/publish.yml"
click node_docs "https://github.com/anentrypoint/gm/blob/main/.github/workflows/gh-pages.yml"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_skill,node_instructions,node_spool,node_fsm,node_policies toneBlue
class node_plugkit,node_wasm,node_nativehost,node_memory,node_browser,node_indexdeps toneAmber
class node_publish,node_docs,node_site toneMint
class node_package,node_installer,node_bootstrap toneNeutral
