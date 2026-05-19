const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

const TOKEN = process.env.TOKEN;
const DONO_ID = "1456655598593511539";

if (!TOKEN) {
  console.log("❌ TOKEN não encontrado.");
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
      reason: "Cargo criado pelo bot organizador"
    });
  }

  return cargo;
}

function montarPermissoes(guild, bloco, cargoPrivado) {
  const everyone = guild.roles.everyone;
  const botId = guild.members.me.id;

  if (bloco.admin) {
    return [
      {
        id: everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
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

async function buscarOuCriarCategoria(guild, nome, permissoes, posicao) {
  let categoria = guild.channels.cache.find(
    c => c.name === nome && c.type === ChannelType.GuildCategory
  );

  if (!categoria) {
    categoria = await guild.channels.create({
      name: nome,
      type: ChannelType.GuildCategory,
      permissionOverwrites: permissoes,
      position: posicao,
      reason: "Categoria criada pelo bot organizador"
    });
  } else {
    await categoria.permissionOverwrites.set(permissoes);
    await categoria.setPosition(posicao).catch(() => {});
  }

  return categoria;
}

async function buscarOuCriarCanal(guild, nome, tipo, categoria, permissoes) {
  let canal = guild.channels.cache.find(
    c => c.name === nome && c.type === tipo
  );

  if (!canal) {
    canal = await guild.channels.create({
      name: nome,
      type: tipo,
      parent: categoria.id,
      permissionOverwrites: permissoes,
      reason: "Canal criado pelo bot organizador"
    });
  } else {
    if (canal.parentId !== categoria.id) {
      await canal.setParent(categoria.id, { lockPermissions: false });
    }

    await canal.permissionOverwrites.set(permissoes);
  }

  return canal;
}

async function organizarServidor(guild) {
  let categorias = 0;
  let canaisTexto = 0;
  let canaisVoz = 0;

  await guild.channels.fetch();
  await guild.roles.fetch();

  for (let i = 0; i < estrutura.length; i++) {
    const bloco = estrutura[i];

    let cargoPrivado = null;

    if (bloco.privado && bloco.cargo) {
      cargoPrivado = await criarCargo(guild, bloco.cargo);
    }

    const permissoes = montarPermissoes(guild, bloco, cargoPrivado);

    const categoria = await buscarOuCriarCategoria(
      guild,
      bloco.categoria,
      permissoes,
      i
    );

    categorias++;

    if (bloco.canais) {
      for (const nome of bloco.canais) {
        await buscarOuCriarCanal(
          guild,
          nome,
          ChannelType.GuildText,
          categoria,
          permissoes
        );

        canaisTexto++;
      }
    }

    if (bloco.voz) {
      for (const nome of bloco.voz) {
        await buscarOuCriarCanal(
          guild,
          nome,
          ChannelType.GuildVoice,
          categoria,
          permissoes
        );

        canaisVoz++;
      }
    }
  }

  return {
    categorias,
    canaisTexto,
    canaisVoz
  };
}

client.once("ready", () => {
  console.log("=================================");
  console.log("✅ BOT ONLINE");
  console.log(`🤖 ${client.user.tag}`);
  console.log("✅ Comando: !organizar");
  console.log("=================================");
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const comando = message.content.trim().toLowerCase();

  if (comando !== "!organizar") return;

  if (message.author.id !== DONO_ID) {
    return message.reply("❌ Apenas o dono pode usar esse comando.");
  }

  const botMember = message.guild.members.me;

  if (!botMember.permissions.has(PermissionFlagsBits.Administrator)) {
    return message.reply(
      "❌ O bot precisa estar com permissão de ADMINISTRADOR para organizar o servidor."
    );
  }

  try {
    const aviso = await message.reply("🔧 Verificando salas e organizando abas...");

    const resultado = await organizarServidor(message.guild);

    await aviso.edit(
      `✅ Servidor organizado com sucesso!\n\n📁 Categorias verificadas/criadas: ${resultado.categorias}\n💬 Canais de texto organizados: ${resultado.canaisTexto}\n🔊 Canais de voz organizados: ${resultado.canaisVoz}`
    );
  } catch (erro) {
    console.log("❌ ERRO AO ORGANIZAR:");
    console.log(erro);

    await message.reply(
      "❌ Deu erro ao organizar. Confira se o bot está acima dos cargos e com Administrador."
    );
  }
});

client.login(TOKEN);
