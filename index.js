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
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) {
  console.log("❌ TOKEN não encontrado nas Variables do Railway.");
  process.exit(1);
}

if (!GUILD_ID) {
  console.log("❌ GUILD_ID não encontrado nas Variables do Railway.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const estrutura = [
  {
    categoria: "📌 BASE DA RESENHA",
    tipoPermissao: "publico",
    canais: ["💭・bem-vindo", "📌・regras", "📢・avisos"]
  },
  {
    categoria: "🌆 CIDADE EUFORIA",
    tipoPermissao: "publico",
    canais: ["eufo👾", "eufo-fotos👾"]
  },
  {
    categoria: "☣️ FIVEZ / PROJETO X",
    tipoPermissao: "publico",
    canais: [
      "farme-fivez👾",
      "📌 Regras-Projeto-X",
      "💬 Chat-Projeto-X",
      "📋 MEMBROS",
      "📢 avisos",
      "💰 valores-clã",
      "💰 valores-clãs",
      "👕 roupa"
    ],
    voz: ["BATE PAPO FiveZ", "BATE PAPO LIVE", "BATE PAPO DAYZ 2"]
  },
  {
    categoria: "💎 ÁREA VIP • FAMÍLIA SOUZA",
    tipoPermissao: "familia",
    canais: [
      "💎・familia-souza",
      "👕・set-roupas",
      "👗・roupas-aurora",
      "🧥・roupas-henrique"
    ],
    voz: [
      "familia",
      "🔒｜💎-FAMILIA-SOUZA・",
      "resenha-familia",
      "familia-naty"
    ]
  },
  {
    categoria: "🏥 HOSPITAL / BELLA",
    tipoPermissao: "publico",
    canais: [
      "🎥・lives",
      "📸・midia",
      "💡・sugestões",
      "❌｜denúncias",
      "🎁｜divulgação"
    ]
  },
  {
    categoria: "🎯 METAS SEMANAIS 📊",
    tipoPermissao: "metas",
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
    tipoPermissao: "publico",
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
    tipoPermissao: "publico",
    canais: ["🤖・jogos", "🤖・comandos"]
  },
  {
    categoria: "👮 ADMIN",
    tipoPermissao: "admin",
    canais: ["🚫・denuncias", "⭐｜suporte"]
  }
];

async function buscarOuCriarCargo(guild, nome, cor = "Blue") {
  let cargo = guild.roles.cache.find(r => r.name === nome);

  if (!cargo) {
    cargo = await guild.roles.create({
      name: nome,
      color: cor,
      reason: "Cargo criado automaticamente pelo bot"
    });
  }

  return cargo;
}

function permissoesCategoria(guild, tipo, cargoFamilia) {
  const everyone = guild.roles.everyone;

  if (tipo === "admin") {
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
      }
    ];
  }

  if (tipo === "familia") {
    return [
      {
        id: everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: cargoFamilia.id,
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

  if (tipo === "metas") {
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

client.once("ready", async () => {
  console.log("================================");
  console.log("✅ BOT ONLINE");
  console.log(`🤖 ${client.user.tag}`);
  console.log(`🏠 Servidor ID: ${GUILD_ID}`);
  console.log("================================");

  const commands = [
    new SlashCommandBuilder()
      .setName("organizar")
      .setDescription("Organiza o Discord completo com permissões")
      .toJSON()
  ];

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log("⌛ Registrando comando /organizar...");

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, GUILD_ID),
      { body: commands }
    );

    console.log("✅ Comando /organizar registrado!");
  } catch (erro) {
    console.log("❌ ERRO AO REGISTRAR /organizar:");
    console.log(erro);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "organizar") {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ Você precisa ser administrador.",
        ephemeral: true
      });
    }

    await interaction.reply("🔧 Organizando o Discord com permissões...");

    const guild = interaction.guild;

    const cargoFamilia = await buscarOuCriarCargo(
      guild,
      "💎 FAMÍLIA SOUZA",
      "Blue"
    );

    for (const bloco of estrutura) {
      const overwrites = permissoesCategoria(
        guild,
        bloco.tipoPermissao,
        cargoFamilia
      );

      let categoria = guild.channels.cache.find(
        c => c.name === bloco.categoria && c.type === ChannelType.GuildCategory
      );

      if (!categoria) {
        categoria = await guild.channels.create({
          name: bloco.categoria,
          type: ChannelType.GuildCategory,
          permissionOverwrites: overwrites
        });
      } else {
        await categoria.permissionOverwrites.set(overwrites);
      }

      if (bloco.canais) {
        for (const nome of bloco.canais) {
          let canal = guild.channels.cache.find(
            c => c.name === nome && c.type === ChannelType.GuildText
          );

          if (!canal) {
            canal = await guild.channels.create({
              name: nome,
              type: ChannelType.GuildText,
              parent: categoria.id,
              permissionOverwrites: overwrites
            });
          } else {
            await canal.setParent(categoria.id);
            await canal.permissionOverwrites.set(overwrites);
          }
        }
      }

      if (bloco.voz) {
        for (const nome of bloco.voz) {
          let canal = guild.channels.cache.find(
            c => c.name === nome && c.type === ChannelType.GuildVoice
          );

          if (!canal) {
            canal = await guild.channels.create({
              name: nome,
              type: ChannelType.GuildVoice,
              parent: categoria.id,
              permissionOverwrites: overwrites
            });
          } else {
            await canal.setParent(categoria.id);
            await canal.permissionOverwrites.set(overwrites);
          }
        }
      }
    }

    await interaction.editReply("✅ Discord organizado com abas e permissões corretas!");
  }
});

client.login(TOKEN);
