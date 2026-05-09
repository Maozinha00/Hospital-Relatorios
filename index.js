import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";

// ==========================================
// CLIENT
// ==========================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// ==========================================
// CONFIGURAÇÕES
// ==========================================

// CANAL DE RELATÓRIOS
const CANAL_RELATORIOS = "1477683906026406084";

// CARGO QUE PODE USAR O BOT
const CARGO_PERMITIDO = "1490431614055088128";

// CARGOS SUPERIORES
const CARGOS_SUPERIORES = [
  "Diretor",
  "Vice-Diretor",
  "Supervisor",
  "Coordenador",
];

// ==========================================
// BOT ONLINE
// ==========================================

client.once("ready", () => {
  console.log("=================================");
  console.log(`✅ BOT ONLINE: ${client.user.tag}`);
  console.log("=================================");
});

// ==========================================
// SISTEMA DE MENSAGENS
// ==========================================

client.on("messageCreate", async (message) => {
  try {
    // IGNORA BOT
    if (message.author.bot) return;

    // SOMENTE NO CANAL CONFIGURADO
    if (message.channel.id !== CANAL_RELATORIOS) return;

    // VERIFICA CARGO
    if (
      !message.member.roles.cache.has(CARGO_PERMITIDO)
    ) {
      return;
    }

    // ==========================================
    // COMANDO: !PAINELRELATORIO
    // ==========================================

    if (message.content === "!painelrelatorio") {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("📋 Sistema de Relatórios — Hospital")
        .setDescription(`
Olá @|👑| Diretor (a)  
@|🎖️| Vice.Diretor (a)  
@|🔱| Supervisor (a)  
@|📋| Coordenador (a)

Essa aba será utilizada para:

• 📄 Relatórios Gerais  
• 📊 Frequência dos membros  
• 🩺 Avaliação de desempenho  
• ⏳ Tempo de serviço  
• ✅ Qualidade de serviço  
• ⭐ Desempenho geral  

━━━━━━━━━━━━━━━━━━

📌 Somente cargos superiores podem realizar relatórios.

• 👑 Diretor  
• 🎖️ Vice-Diretor  
• 🔱 Supervisor  
• 📋 Coordenador  

━━━━━━━━━━━━━━━━━━

📄 Exemplo de relatório:

📄 Relatório Geral — Membro: Mary Blood  
📌 Cargo Atual: Médica

📊 Frequência dos membros:
Boa frequência e participação ativa.

🩺 Avaliação de desempenho:
Boa comunicação e ótimo RP.

⏳ Tempo de serviço:
Tempo adequado ao cargo.

✅ Qualidade de serviço:
Atendimentos rápidos e eficientes.

⭐ Desempenho geral:
Boa profissional com potencial de crescimento.

━━━━━━━━━━━━━━━━━━

👑 Responsável:
Diretor Henrique
        `)
        .setFooter({
          text: "Sistema Hospitalar",
        })
        .setTimestamp();

      await message.channel.send({
        embeds: [embed],
      });
    }

    // ==========================================
    // COMANDO: !RELATORIO
    // ==========================================

    if (message.content.startsWith("!relatorio")) {
      const args = message.content.split(" ");

      // MEMBRO
      const membro = message.mentions.users.first();

      if (!membro) {
        return message.reply(
          "❌ Você precisa mencionar um membro."
        );
      }

      // CARGO
      const cargo = args[2];

      if (!cargo) {
        return message.reply(
          "❌ Informe o cargo."
        );
      }

      // VERIFICA SE É CARGO SUPERIOR
      if (!CARGOS_SUPERIORES.includes(cargo)) {
        return message.reply(`
❌ Apenas cargos superiores podem utilizar relatórios.

Cargos permitidos:
• Diretor
• Vice-Diretor
• Supervisor
• Coordenador
        `);
      }

      // DADOS
      const frequencia =
        args[3] || "Não informado";

      const avaliacao =
        args[4] || "Não informado";

      const tempo =
        args[5] || "Não informado";

      const qualidade =
        args[6] || "Não informado";

      const desempenho =
        args[7] || "Não informado";

      // EMBED
      const embed = new EmbedBuilder()
        .setColor("#00ff88")
        .setTitle("📄 Relatório Geral")
        .setThumbnail(
          membro.displayAvatarURL({
            dynamic: true,
          })
        )
        .addFields(
          {
            name: "👤 Membro",
            value: `${membro}`,
            inline: true,
          },
          {
            name: "📌 Cargo Superior",
            value: cargo,
            inline: true,
          },
          {
            name: "📊 Frequência dos membros",
            value: frequencia,
          },
          {
            name:
              "🩺 Avaliação de desempenho",
            value: avaliacao,
          },
          {
            name: "⏳ Tempo de serviço",
            value: tempo,
          },
          {
            name:
              "✅ Qualidade de serviço",
            value: qualidade,
          },
          {
            name: "⭐ Desempenho geral",
            value: desempenho,
          }
        )
        .setFooter({
          text: `Relatório realizado por ${message.author.username}`,
        })
        .setTimestamp();

      await message.channel.send({
        embeds: [embed],
      });
    }
  } catch (err) {
    console.log(err);

    message.reply(
      "❌ Ocorreu um erro ao executar o comando."
    );
  }
});

// ==========================================
// LOGIN
// ==========================================

client.login(process.env.TOKEN);
