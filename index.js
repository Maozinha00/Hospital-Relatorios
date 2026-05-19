const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

const TOKEN = process.env.TOKEN;
const DONO_ID = "1456655598593511539";

if (!TOKEN) {
  console.log("❌ TOKEN não encontrado nas Variables do Railway.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const estrutura = [
  {
    categoria: "📌 BASE DA RESENHA",
    texto: ["💭・bem-vindo", "📌・regras", "📢・avisos"]
  },
  {
    categoria: "🌆 CIDADE EUFORIA",
    texto: ["eufo👾", "eufo-fotos👾"]
  },
  {
    categoria: "☣️ FIVEZ / PROJETO X",
    texto: [
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
    texto: [
      "💎・familia-souza",
      "👕・set-roupas",
      "👗・roupas-aurora",
      "🧥・roupas-henrique"
    ],
    voz: ["familia", "resenha-familia", "familia-naty"]
  },
  {
    categoria: "🏥 HOSPITAL / BELLA",
    texto: [
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
    texto: [
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
    texto: ["🤖・jogos", "🤖・comandos"]
  },
  {
    categoria: "👮 ADMIN",
    admin: true,
    texto: ["🚫・denuncias", "⭐・suporte"]
  }
];

async function criarCargo(guild, nome) {
  let cargo = guild.roles.cache.find(r => r.name === nome);

  if (!cargo) {
    cargo = await guild.roles.create({
      name: nome,
      reason: "Cargo criado pelo bot organizador"
    });
  }

  return cargo;
}

function permissoes(guild, bloco, cargoPrivado) {
  const everyone = guild.roles.everyone;
  const botId = guild.members.me.id;

  if (bloco.admin) {
    return [
      {
        id: everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
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
      },
      {
        id: botId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ManageChannels,
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
        id: botId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
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
        id: botId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
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
      id: botId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak
      ]
    }
  ];
}

async function buscarCategoria(guild, nome) {
  return guild.channels.cache.find(
    c => c.name === nome && c.type === ChannelType.GuildCategory
  );
}

async function criarOuAtualizarCategoria(guild, nome, overwrites, posicao) {
  let categoria = await buscarCategoria(guild, nome);

  if (!categoria) {
    categoria = await guild.channels.create({
      name: nome,
      type: ChannelType.GuildCategory,
      permissionOverwrites: overwrites,
      position: posicao
    });
  } else {
    await categoria.permissionOverwrites.set(overwrites).catch(() => {});
    await categoria.setPosition(posicao).catch(() => {});
  }

  return categoria;
}

async function criarOuMoverCanal(guild, nome, tipo, categoria, overwrites) {
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
    await canal.setParent(categoria.id, { lockPermissions: false }).catch(() => {});
    await canal.permissionOverwrites.set(overwrites).catch(() => {});
  }

  return canal;
}

async function organizar(guild) {
  await guild.channels.fetch();
  await guild.roles.fetch();

  let categorias = 0;
  let textos = 0;
  let vozes = 0;

  for (let i = 0; i < estrutura.length; i++) {
    const bloco = estrutura[i];

    let cargoPrivado = null;

    if (bloco.privado && bloco.cargo) {
      cargoPrivado = await criarCargo(guild, bloco.cargo);
    }

    const overwrites = permissoes(guild, bloco, cargoPrivado);

    const categoria = await criarOuAtualizarCategoria(
      guild,
      bloco.categoria,
      overwrites,
      i
    );

    categorias++;

    if (bloco.texto) {
      for (const nome of bloco.texto) {
        await criarOuMoverCanal(
          guild,
          nome,
          ChannelType.GuildText,
          categoria,
          overwrites
        );
        textos++;
      }
    }

    if (bloco.voz) {
      for (const nome of bloco.voz) {
        await criarOuMoverCanal(
          guild,
          nome,
          ChannelType.GuildVoice,
          categoria,
          overwrites
        );
        vozes++;
      }
    }
  }

  return { categorias, textos, vozes };
}

client.once("ready", () => {
  console.log("=================================");
  console.log("✅ BOT ONLINE NOVO");
  console.log(`🤖 ${client.user.tag}`);
  console.log("✅ COMANDO ATIVO: !organizar");
  console.log("=================================");
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.trim().toLowerCase() !== "!organizar") return;

  if (message.author.id !== DONO_ID) {
    return message.reply("❌ Apenas o dono pode usar esse comando.");
  }

  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
    return message.reply("❌ O bot precisa de permissão de Administrador.");
  }

  try {
    const msg = await message.reply("🔧 Verificando e organizando as salas...");

    const resultado = await organizar(message.guild);

    await msg.edit(
      `✅ Servidor organizado com sucesso!\n\n📁 Categorias: ${resultado.categorias}\n💬 Canais de texto: ${resultado.textos}\n🔊 Canais de voz: ${resultado.vozes}`
    );
  } catch (err) {
    console.log("❌ ERRO AO ORGANIZAR:");
    console.log(err);

    await message.reply(
      "❌ Deu erro. Coloque o cargo do bot no topo e dê permissão de Administrador."
    );
  }
});

client.login(TOKEN);
