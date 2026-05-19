const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  REST,
  Routes
} = require("discord.js");

const TOKEN = process.env.TOKEN;

const GUILD_ID = "1456655598031601727";
const CLIENT_ID = "1506127641810305144";
const DONO_ID = "1456655598593511539";

if (!TOKEN) {
  console.log("❌ TOKEN não encontrado nas Variables do Railway.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const estrutura = [
  {
    categoria: "📌 BASE DA RESENHA",
    canais: ["💭・bem-vindo", "📌・regras", "📢・avisos"]
  },
  {
    categoria: "🌆 CIDADE EUFORIA",
    canais: ["eufo👾", "eufo-fotos👾"]
  },
  {
    categoria: "☣️ FIVEZ / PROJETO X",
    canais: [
      "farme-fivez👾",
      "📌・regras-projeto-x",
      "💬・chat-projeto-x",
      "📋・membros",
      "📢・avisos",
      "💰・valores-clã",
      "👕・roupa"
    ],
    voz: ["BATE PAPO FiveZ", "BATE PAPO LIVE", "BATE PAPO DAYZ 2"]
  },
  {
    categoria: "💎 ÁREA VIP • FAMÍLIA SOUZA",
    privado: true,
    cargo: "💎 FAMÍLIA SOUZA",
    canais: [
      "💎・familia-souza",
      "👕・set-roupas",
      "👗・roupas-aurora",
      "🧥・roupas-henrique"
    ],
    voz: ["familia", "resenha-familia", "familia-naty"]
  },
  {
    categoria: "🏥 HOSPITAL / BELLA",
    canais: [
      "🎥・lives",
      "📸・midia",
      "💡・sugestões",
      "❌・denúncias",
      "🎁・divulgação"
    ]
  },
  {
    categoria: "🎯 METAS SEMANAIS 📊",
    somenteLeitura: true,
    canais: [
      "👑・seven-desconhecido",
      "💼・henrique-souza",
      "💼・aurora-souza",
      "💼・mano-giga",
      "👥・australopitecus-hahaha",
      "👥・francisco-miller",
      "👥・sophia-santos",
      "📋・jopa-aky",
      "📋・ban-ban-jackson",
      "📋・block-wood",
      "📋・coelho-zerovintum",
      "📋・crazy-zzz",
      "📋・jhony-deep",
      "📋・logan-poll",
      "📋・mateus-urgbar",
      "📋・saimon-sixone",
      "📋・walter-magalhaes"
    ]
  },
  {
    categoria: "🔊 VOZ",
    voz: [
      "🔇・sem-microfone",
      "🔊 MEMBROS NOVOS",
      "🔊・geral-1",
      "🔊・geral-2",
      "Geral 3",
      "Geral 4",
      "Geral 5"
    ]
  },
  {
    categoria: "🤖 BOTS",
    canais: ["🤖・jogos", "🤖・comandos"]
  },
  {
    categoria: "👮 ADMIN",
    admin: true,
    canais: ["🚫・denuncias", "⭐・suporte"]
  }
];

async function criarCargo(guild, nome) {
  let cargo = guild.roles.cache.find(r => r.name === nome);

  if (!cargo) {
    cargo = await guild.roles.create({
      name: nome,
      reason: "Cargo criado automaticamente"
    });
  }

  return cargo;
}

function permissoes(guild, bloco, cargoPrivado) {
  const everyone = guild.roles.everyone;

  if (bloco.admin) {
    return [
      {
        id: everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: guild.members.me.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak
        ]
      },
      {
        id: DONO_ID,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak
        ]
      }
    ];
  }

  if (bloco.privado && cargoPrivado) {
    return [
      {
        id: everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: cargoPrivado.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak
        ]
      },
      {
        id: guild.members.me.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak
        ]
      }
    ];
  }

  if (bloco.somenteLeitura) {
    return [
      {
        id: everyone.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory
        ],
        deny: [PermissionFlagsBits.SendMessages]
      },
      {
        id: guild.members.me.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.SendMessages
        ]
      }
    ];
  }

  return [
    {
      id: everyone.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak
      ]
    },
    {
      id: guild.members.me.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak
      ]
    }
  ];
}

async function buscarOuCriarCategoria(guild, nome, overwrites, posicao) {
  let categoria = guild.channels.cache.find(
    c => c.name === nome && c.type === ChannelType.GuildCategory
  );

  if (!categoria) {
    categoria = await guild.channels.create({
      name: nome,
      type: ChannelType.GuildCategory,
      permissionOverwrites: overwrites,
      position: posicao
    });
  } else {
    await categoria.permissionOverwrites.set(overwrites);
    await categoria.setPosition(posicao);
  }

  return categoria;
}

async function buscarOuCriarCanal(guild, nome, tipo, categoria, overwrites) {
  let canal = guild.channels.cache.find(
    c => c.name === nome && c.type === tipo
  );

  if (!canal) {
    canal = await guild.channels.create({
      name: nome,
      type: tipo,
      parent: categoria.id,
      permissionOverwrites: overwrites
    });
  } else {
    await canal.setParent(categoria.id, {
      lockPermissions: false
    });

    await canal.permissionOverwrites.set(overwrites);
  }

  return canal;
}

client.once("ready", async () => {
  console.log("================================");
  console.log("✅ BOT ONLINE");
  console.log(`🤖 ${client.user.tag}`);
  console.log("================================");

  const commands = [
    new SlashCommandBuilder()
      .setName("organizar")
      .setDescription("Cria e organiza o Discord")
      .toJSON()
  ];

  const rest = new REST({
    version: "10"
  }).setToken(TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      {
        body: commands
      }
    );

    console.log("✅ /organizar registrado!");
  } catch (err) {
    console.log("❌ Erro ao registrar comando:");
    console.log(err);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "organizar") return;

  if (interaction.user.id !== DONO_ID) {
    return interaction.reply({
      content: "❌ Apenas o dono pode usar este comando.",
      ephemeral: true
    });
  }

  await interaction.reply("🔧 Organizando Discord...");

  const guild = interaction.guild;
  let contador = 0;

  for (let i = 0; i < estrutura.length; i++) {
    const bloco = estrutura[i];

    let cargoPrivado = null;

    if (bloco.privado && bloco.cargo) {
      cargoPrivado = await criarCargo(guild, bloco.cargo);
    }

    const overwrites = permissoes(guild, bloco, cargoPrivado);

    const categoria = await buscarOuCriarCategoria(
      guild,
      bloco.categoria,
      overwrites,
      i
    );

    if (bloco.canais) {
      for (const nome of bloco.canais) {
        await buscarOuCriarCanal(
          guild,
          nome,
          ChannelType.GuildText,
          categoria,
          overwrites
        );

        contador++;
      }
    }

    if (bloco.voz) {
      for (const nome of bloco.voz) {
        await buscarOuCriarCanal(
          guild,
          nome,
          ChannelType.GuildVoice,
          categoria,
          overwrites
        );

        contador++;
      }
    }
  }

  await interaction.editReply(
    `✅ Discord organizado com sucesso!\n📁 Categorias: ${estrutura.length}\n📌 Canais: ${contador}`
  );
});

client.login(TOKEN);
