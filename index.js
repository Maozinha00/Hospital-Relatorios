const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  REST,
  Routes
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const estrutura = [
  {
    categoria: "📌 BASE DA RESENHA",
    canais: [
      "💭・bem-vindo",
      "📌・regras",
      "📢・avisos"
    ]
  },

  {
    categoria: "🌆 CIDADE EUFORIA",
    canais: [
      "eufo👾",
      "eufo-fotos👾"
    ]
  },

  {
    categoria: "☣️ FIVEZ / PROJETO X",
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
    voz: [
      "BATE PAPO FiveZ",
      "BATE PAPO LIVE",
      "BATE PAPO DAYZ 2"
    ]
  },

  {
    categoria: "💎 ÁREA VIP • FAMÍLIA SOUZA",
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
    canais: [
      "🤖・jogos",
      "🤖・comandos"
    ]
  },

  {
    categoria: "👮 ADMIN",
    canais: [
      "🚫・denuncias",
      "⭐｜suporte"
    ]
  }
];

client.once("ready", async () => {
  console.log(`✅ Bot ligado como ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName("organizar")
      .setDescription("Organiza o Discord por cidade, família e metas")
      .toJSON()
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log("✅ Comando /organizar registrado.");
  } catch (erro) {
    console.log("Erro ao registrar comando:", erro);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "organizar") {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ Você precisa ser administrador para usar esse comando.",
        ephemeral: true
      });
    }

    await interaction.reply("🔧 Organizando o Discord...");

    const guild = interaction.guild;

    for (const bloco of estrutura) {
      let categoria = guild.channels.cache.find(
        c => c.name === bloco.categoria && c.type === ChannelType.GuildCategory
      );

      if (!categoria) {
        categoria = await guild.channels.create({
          name: bloco.categoria,
          type: ChannelType.GuildCategory
        });
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
              parent: categoria.id
            });
          } else {
            await canal.setParent(categoria.id);
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
              parent: categoria.id
            });
          } else {
            await canal.setParent(categoria.id);
          }
        }
      }
    }

    await interaction.editReply("✅ Discord organizado com sucesso!");
  }
});

client.login(process.env.TOKEN);
