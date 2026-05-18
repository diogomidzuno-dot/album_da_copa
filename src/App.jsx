import React, { useEffect, useMemo, useState } from "react";
import { supabase } from './supabase';

const TEAM_CODES = {
  "México": "MEX",
  "África do Sul": "RSA",
  "Coreia do Sul": "KOR",
  "República Tcheca": "CZE",
  "Canadá": "CAN",
  "Bósnia": "BIH",
  "Catar": "QAT",
  "Suíça": "SUI",
  "Brasil": "BRA",
  "Marrocos": "MAR",
  "Haiti": "HAI",
  "Escócia": "SCO",
  "Estados Unidos": "USA",
  "Paraguai": "PAR",
  "Austrália": "AUS",
  "Turquia": "TUR",
  "Alemanha": "GER",
  "Curaçao": "CUW",
  "Costa do Marfim": "CIV",
  "Equador": "ECU",
  "Holanda": "NED",
  "Japão": "JPN",
  "Suécia": "SWE",
  "Tunísia": "TUN",
  "Bélgica": "BEL",
  "Egito": "EGY",
  "Irã": "IRN",
  "Nova Zelândia": "NZL",
  "Espanha": "ESP",
  "Cabo Verde": "CPV",
  "Arábia Saudita": "KSA",
  "Uruguai": "URU",
  "França": "FRA",
  "Senegal": "SEN",
  "Iraque": "IRQ",
  "Noruega": "NOR",
  "Argentina": "ARG",
  "Argélia": "ALG",
  "Áustria": "AUT",
  "Jordânia": "JOR",
  "Portugal": "POR",
  "RD Congo": "COD",
  "Uzbequistão": "UZB",
  "Colômbia": "COL",
  "Inglaterra": "ENG",
  "Croácia": "CRO",
  "Gana": "GHA",
  "Panamá": "PAN",
};

const TEAM_FLAGS = {
  "México": "🇲🇽",
  "África do Sul": "🇿🇦",
  "Coreia do Sul": "🇰🇷",
  "República Tcheca": "🇨🇿",
  "Canadá": "🇨🇦",
  "Bósnia": "🇧🇦",
  "Catar": "🇶🇦",
  "Suíça": "🇨🇭",
  "Brasil": "🇧🇷",
  "Marrocos": "🇲🇦",
  "Haiti": "🇭🇹",
  "Escócia": "🏴",
  "Estados Unidos": "🇺🇸",
  "Paraguai": "🇵🇾",
  "Austrália": "🇦🇺",
  "Turquia": "🇹🇷",
  "Alemanha": "🇩🇪",
  "Curaçao": "🇨🇼",
  "Costa do Marfim": "🇨🇮",
  "Equador": "🇪🇨",
  "Holanda": "🇳🇱",
  "Japão": "🇯🇵",
  "Suécia": "🇸🇪",
  "Tunísia": "🇹🇳",
  "Bélgica": "🇧🇪",
  "Egito": "🇪🇬",
  "Irã": "🇮🇷",
  "Nova Zelândia": "🇳🇿",
  "Espanha": "🇪🇸",
  "Cabo Verde": "🇨🇻",
  "Arábia Saudita": "🇸🇦",
  "Uruguai": "🇺🇾",
  "França": "🇫🇷",
  "Senegal": "🇸🇳",
  "Iraque": "🇮🇶",
  "Noruega": "🇳🇴",
  "Argentina": "🇦🇷",
  "Argélia": "🇩🇿",
  "Áustria": "🇦🇹",
  "Jordânia": "🇯🇴",
  "Portugal": "🇵🇹",
  "RD Congo": "🇨🇩",
  "Uzbequistão": "🇺🇿",
  "Colômbia": "🇨🇴",
  "Inglaterra": "🏴",
  "Croácia": "🇭🇷",
  "Gana": "🇬🇭",
  "Panamá": "🇵🇦",
};

const GROUPS = [
  { group: "A", teams: ["México", "África do Sul", "Coreia do Sul", "República Tcheca"] },
  { group: "B", teams: ["Canadá", "Bósnia", "Catar", "Suíça"] },
  { group: "C", teams: ["Brasil", "Marrocos", "Haiti", "Escócia"] },
  { group: "D", teams: ["Estados Unidos", "Paraguai", "Austrália", "Turquia"] },
  { group: "E", teams: ["Alemanha", "Curaçao", "Costa do Marfim", "Equador"] },
  { group: "F", teams: ["Holanda", "Japão", "Suécia", "Tunísia"] },
  { group: "G", teams: ["Bélgica", "Egito", "Irã", "Nova Zelândia"] },
  { group: "H", teams: ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"] },
  { group: "I", teams: ["França", "Senegal", "Iraque", "Noruega"] },
  { group: "J", teams: ["Argentina", "Argélia", "Áustria", "Jordânia"] },
  { group: "K", teams: ["Portugal", "RD Congo", "Uzbequistão", "Colômbia"] },
  { group: "L", teams: ["Inglaterra", "Croácia", "Gana", "Panamá"] },
];

const STORAGE_KEY = "album-copa-2026-v5";
const SYNC_CONFIG_KEY = "album-copa-2026-sync-config";

function makeStickers(prefix, amount) {
  return Array.from({ length: amount }, (_, index) => ({
    number: `${prefix} ${String(index + 1).padStart(2, "0")}`,
    owned: false,
    repeated: 0,
  }));
}

function createAlbum() {
  const specialSections = [
    {
      group: "ESPECIAIS",
      team: "FWC - Especiais",
      code: "FWC",
      flag: "🏆",
      stickers: makeStickers("FWC", 30),
    },
    {
      group: "PROMO",
      team: "Coca-Cola",
      code: "COKE",
      flag: "🥤",
      stickers: makeStickers("COKE", 15),
    },
  ];

  const teamSections = GROUPS.flatMap((group) =>
    group.teams.map((team) => ({
      group: group.group,
      team,
      code: TEAM_CODES[team],
      flag: TEAM_FLAGS[team],
      stickers: makeStickers(TEAM_CODES[team], 20),
    }))
  );

  return [...specialSections, ...teamSections];
}

function normalizeSavedAlbum(savedAlbum) {
  if (!Array.isArray(savedAlbum)) return createAlbum();

  const template = createAlbum();

  return template.map((section) => {
    const savedSection = savedAlbum.find(
      (item) => item.team === section.team && item.group === section.group
    );

    if (!savedSection) return section;

    return {
      ...section,
      stickers: section.stickers.map((sticker) => {
        const savedSticker = savedSection.stickers?.find(
          (item) => String(item.number) === String(sticker.number)
        );

        return {
          ...sticker,
          owned: Boolean(savedSticker?.owned),
          repeated: Number(savedSticker?.repeated || 0),
        };
      }),
    };
  });
}

function getStats(album) {
  const all = album.flatMap((section) => section.stickers);
  const total = all.length;
  const owned = all.filter((sticker) => sticker.owned).length;
  const repeated = all.reduce((sum, sticker) => sum + Number(sticker.repeated || 0), 0);

  return {
    total,
    owned,
    missing: total - owned,
    repeated,
    progress: total ? Math.round((owned / total) * 100) : 0,
  };
}

function buildPdfRows(album) {
  return album.map((section) => {
    const have = section.stickers.filter((sticker) => sticker.owned).map((sticker) => sticker.number);
    const missing = section.stickers.filter((sticker) => !sticker.owned).map((sticker) => sticker.number);
    const repeated = section.stickers
      .filter((sticker) => Number(sticker.repeated || 0) > 0)
      .map((sticker) => `${sticker.number} (${sticker.repeated}x)`);

    return {
      group: section.group === "ESPECIAIS" || section.group === "PROMO" ? section.group : `Grupo ${section.group}`,
      title: `${section.code} - ${section.team}`,
      progress: `${have.length}/${section.stickers.length}`,
      have: have.length ? have.join(", ") : "Nenhuma",
      missing: missing.length ? missing.join(", ") : "Completo",
      repeated: repeated.length ? repeated.join(", ") : "Nenhuma",
    };
  });
}

function buildReportText(album, stats) {
  const rows = buildPdfRows(album)
    .map((row) => {
      return [
        `${row.group} | ${row.title} | ${row.progress}`,
        `TENHO: ${row.have}`,
        `FALTAM: ${row.missing}`,
        `REPETIDAS: ${row.repeated}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    "RELATÓRIO DO ÁLBUM COPA DO MUNDO 2026",
    `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
    "",
    `Total: ${stats.total}`,
    `Encontradas: ${stats.owned}`,
    `Faltando: ${stats.missing}`,
    `Repetidas: ${stats.repeated}`,
    `Progresso: ${stats.progress}%`,
    "",
    rows,
  ].join("\n");
}

function downloadTextReport(album, stats) {
  const text = buildReportText(album, stats);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "relatorio-album-copa-2026.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function makeAscii(value) {
  return Array.from(String(value))
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 32 && code <= 126) return char;
      if (char === "á" || char === "à" || char === "ã" || char === "â") return "a";
      if (char === "Á" || char === "À" || char === "Ã" || char === "Â") return "A";
      if (char === "é" || char === "ê") return "e";
      if (char === "É" || char === "Ê") return "E";
      if (char === "í") return "i";
      if (char === "Í") return "I";
      if (char === "ó" || char === "õ" || char === "ô") return "o";
      if (char === "Ó" || char === "Õ" || char === "Ô") return "O";
      if (char === "ú") return "u";
      if (char === "Ú") return "U";
      if (char === "ç") return "c";
      if (char === "Ç") return "C";
      return "";
    })
    .join("")
    .replaceAll("(", "[")
    .replaceAll(")", "]");
}

function createSimplePdf(text) {
  const NL = String.fromCharCode(10);
  const rawLines = makeAscii(text).split(NL);
  const lines = [];
  const maxChars = 92;

  rawLines.forEach((line) => {
    if (line.length <= maxChars) {
      lines.push(line);
      return;
    }

    for (let index = 0; index < line.length; index += maxChars) {
      lines.push(line.slice(index, index + maxChars));
    }
  });

  const pageWidth = 595;
  const pageHeight = 842;
  const marginLeft = 40;
  const marginTop = 45;
  const lineHeight = 12;
  const linesPerPage = Math.floor((pageHeight - marginTop * 2) / lineHeight);
  const pages = [];

  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage));
  }

  const objects = [];

  function addObject(content) {
    objects.push(content);
    return objects.length;
  }

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("__PAGES__");
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];

  pages.forEach((pageLines) => {
    const streamLines = ["BT", "/F1 9 Tf", `${marginLeft} ${pageHeight - marginTop} Td`];

    pageLines.forEach((line, index) => {
      if (index > 0) streamLines.push(`0 -${lineHeight} Td`);
      streamLines.push(`(${line}) Tj`);
    });

    streamLines.push("ET");
    const stream = streamLines.join(NL);
    const contentId = addObject(`<< /Length ${stream.length} >>${NL}stream${NL}${stream}${NL}endstream`);
    const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  });

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = `%PDF-1.4${NL}`;
  const offsets = [0];

  objects.forEach((content, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj${NL}${content}${NL}endobj${NL}`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref${NL}0 ${objects.length + 1}${NL}`;
  pdf += `0000000000 65535 f ${NL}`;

  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n ${NL}`;
  }

  pdf += `trailer${NL}<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>${NL}startxref${NL}${xrefOffset}${NL}%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildBackupPayload(album) {
  return {
    app: "album-copa-2026",
    version: 5,
    exportedAt: new Date().toISOString(),
    album,
  };
}

function exportBackup(album) {
  const payload = buildBackupPayload(album);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  downloadBlob(blob, "backup-album-copa-2026.json");
}

function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const album = Array.isArray(parsed) ? parsed : parsed.album;
        resolve(normalizeSavedAlbum(album));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function getRepeatedRows(album) {
  return album.flatMap((section) =>
    section.stickers
      .filter((sticker) => Number(sticker.repeated || 0) > 0)
      .map((sticker) => ({
        group: section.group === "ESPECIAIS" || section.group === "PROMO" ? section.group : `Grupo ${section.group}`,
        team: section.team,
        code: section.code,
        number: sticker.number,
        repeated: Number(sticker.repeated || 0),
      }))
  );
}

function buildRepeatedShareText(album, stats) {
  const repeatedRows = getRepeatedRows(album);

  if (repeatedRows.length === 0) {
    return "Ainda não tenho figurinhas repetidas cadastradas para troca no álbum da Copa do Mundo 2026.";
  }

  const lines = repeatedRows.map(
    (item) => `• ${item.number} - ${item.team} (${item.code}) - ${item.repeated}x`
  );

  return [
    "Minhas figurinhas repetidas para troca - Copa do Mundo 2026",
    "",
    ...lines,
    "",
    `Total de repetidas: ${stats.repeated}`,
    `Progresso do álbum: ${stats.owned}/${stats.total} (${stats.progress}%)`,
  ].join("\n");
}

function shareRepeatedOnWhatsApp(album, stats) {
  const text = buildRepeatedShareText(album, stats);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function loadSyncConfig() {
  try {
    const saved = localStorage.getItem(SYNC_CONFIG_KEY);
    return saved ? JSON.parse(saved) : { endpoint: "", token: "" };
  } catch {
    return { endpoint: "", token: "" };
  }
}

function saveSyncConfig(config) {
  localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
}

async function pushOnlineSync(album, config) {
  if (!config.endpoint) throw new Error("Informe a URL de sincronização.");

  const response = await fetch(config.endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
    },
    body: JSON.stringify(buildBackupPayload(album)),
  });

  if (!response.ok) {
    throw new Error(`Falha ao enviar sincronização: ${response.status}`);
  }

  return true;
}

async function pullOnlineSync(config) {
  if (!config.endpoint) throw new Error("Informe a URL de sincronização.");

  const response = await fetch(config.endpoint, {
    method: "GET",
    headers: {
      ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao baixar sincronização: ${response.status}`);
  }

  const parsed = await response.json();
  const album = Array.isArray(parsed) ? parsed : parsed.album;
  return normalizeSavedAlbum(album);
}

function generateRealPdf(album, stats) {
  const text = [
    "RELATÓRIO DE FIGURINHAS FALTANTES",
    "ÁLBUM COPA DO MUNDO 2026",
    "",
    `Total: ${stats.total}`,
    `Encontradas: ${stats.owned}`,
    `Faltando: ${stats.missing}`,
    `Repetidas: ${stats.repeated}`,
    `Progresso: ${stats.progress}%`,
    "",
    "==============================",
    "FIGURINHAS QUE FALTAM",
    "==============================",
    "",
    ...album.map((section) => {
      const missing = section.stickers
        .filter((sticker) => !sticker.owned)
        .map((sticker) => sticker.number)

      const have = section.stickers.filter((sticker) => sticker.owned).length
      const total = section.stickers.length

      if (missing.length === 0) {
        return `${section.group === "ESPECIAIS" || section.group === "PROMO" ? section.group : `Grupo ${section.group}`} | ${section.code} - ${section.team} | COMPLETO`
      }

      return [
        `${section.group === "ESPECIAIS" || section.group === "PROMO" ? section.group : `Grupo ${section.group}`} | ${section.code} - ${section.team} | ${have}/${total}`,
        `FALTAM: ${missing.join(", ")}`,
        "",
      ].join("\n")
    }),
    "",
    "==============================",
    "REPETIDAS PARA TROCA",
    "==============================",
    "",
    ...album.map((section) => {
      const repeated = section.stickers
        .filter((sticker) => Number(sticker.repeated || 0) > 0)
        .map((sticker) => `${sticker.number} (${sticker.repeated}x)`)

      if (repeated.length === 0) return ""

      return [
        `${section.code} - ${section.team}`,
        `REPETIDAS: ${repeated.join(", ")}`,
        "",
      ].join("\n")
    }),
  ].join("\n")

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = "figurinhas-faltantes-copa-2026.txt"
  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function runSelfTests() {
  const album = createAlbum();
  const stats = getStats(album);
  const brazil = album.find((section) => section.team === "Brasil");
  const fwc = album.find((section) => section.code === "FWC");
  const coke = album.find((section) => section.code === "COKE");
  const rows = buildPdfRows(album);

  console.assert(Array.isArray(album), "createAlbum deve retornar um array.");
  console.assert(album.length === 50, "O álbum deve ter 48 seleções + FWC + Coca-Cola.");
  console.assert(stats.total === 1005, "O total deve ser 1005 figurinhas: 960 seleções + 30 FWC + 15 Coca-Cola.");
  console.assert(stats.owned === 0, "Álbum novo deve iniciar sem figurinhas encontradas.");
  console.assert(brazil?.code === "BRA", "Brasil deve usar a sigla BRA.");
  console.assert(fwc?.stickers.length === 30, "FWC deve ter 30 figurinhas.");
  console.assert(coke?.stickers.length === 15, "Coca-Cola deve ter 15 figurinhas.");
  console.assert(rows.length === 50, "O relatório deve conter todas as seções do álbum.");
  console.assert(rows.some((row) => row.title.includes("BRA")), "O relatório deve incluir o Brasil.");
}

if (typeof window !== "undefined" && !window.__ALBUM_COPA_2026_TESTED__) {
  window.__ALBUM_COPA_2026_TESTED__ = true;
  runSelfTests();
}

function ToolsPanel({
  album,
  stats,
  onImportBackup,
  syncConfig,
  setSyncConfig,
  onPushSync,
  onPullSync,
  syncStatus,
}) {
  return (
    <div className="bg-white rounded-3xl shadow p-5 mb-6 no-print">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-black">Ferramentas</h2>
          <p className="text-gray-500 text-sm">
            Backup, sincronização online e compartilhamento das repetidas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-2xl p-4 bg-gray-50">
            <h3 className="font-black mb-2">Backup</h3>
            <p className="text-sm text-gray-500 mb-3">Exporte ou importe seu álbum em JSON.</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => exportBackup(album)}
                className="bg-gray-900 text-white rounded-xl px-4 py-2 font-bold"
              >
                Exportar BKP
              </button>
              <label className="bg-white border border-gray-300 rounded-xl px-4 py-2 font-bold cursor-pointer">
                Importar BKP
                <input
                  type="file"
                  accept="application/json"
                  onChange={onImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="border rounded-2xl p-4 bg-gray-50">
            <h3 className="font-black mb-2">WhatsApp</h3>
            <p className="text-sm text-gray-500 mb-3">
              Envie sua lista de repetidas para troca.
            </p>
            <button
              type="button"
              onClick={() => shareRepeatedOnWhatsApp(album, stats)}
              className="bg-green-600 text-white rounded-xl px-4 py-2 font-bold"
            >
              Compartilhar repetidas
            </button>
          </div>

          <div className="border rounded-2xl p-4 bg-gray-50">
            <h3 className="font-black mb-2">Sincronização online</h3>
            <p className="text-sm text-gray-500 mb-3">
              Use uma URL de API/JSON remoto para salvar e recuperar o mesmo álbum em outros dispositivos.
            </p>
            <input
              type="url"
              placeholder="URL de sincronização"
              value={syncConfig.endpoint}
              onChange={(event) => setSyncConfig((prev) => ({ ...prev, endpoint: event.target.value }))}
              className="w-full border rounded-xl p-2 mb-2 text-sm"
            />
            <input
              type="text"
              placeholder="Token opcional"
              value={syncConfig.token}
              onChange={(event) => setSyncConfig((prev) => ({ ...prev, token: event.target.value }))}
              className="w-full border rounded-xl p-2 mb-3 text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onPushSync}
                className="bg-blue-700 text-white rounded-xl px-4 py-2 font-bold"
              >
                Enviar online
              </button>
              <button
                type="button"
                onClick={onPullSync}
                className="bg-indigo-700 text-white rounded-xl px-4 py-2 font-bold"
              >
                Baixar online
              </button>
            </div>
            {syncStatus && <p className="text-xs text-gray-600 mt-2">{syncStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportSection({ album, stats, onClose }) {
  const date = new Date().toLocaleString("pt-BR");

  return (
    <div id="pdf-report" className="bg-white rounded-3xl shadow p-6 mb-8 print-area">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black">Relatório do Álbum Copa do Mundo 2026</h2>
          <p className="text-gray-500">Gerado em {date}</p>
          <p className="text-sm text-gray-500 mt-1">Para gerar PDF: clique em imprimir e escolha “Salvar como PDF”.</p>
        </div>

        <div className="flex gap-2 no-print">
          <button
            type="button"
            onClick={() => generateRealPdf(album, stats)}
            className="bg-blue-700 text-white rounded-xl px-4 py-2 font-bold"
          >
            Baixar PDF
          </button>
          <button
            type="button"
            onClick={() => downloadTextReport(album, stats)}
            className="bg-gray-900 text-white rounded-xl px-4 py-2 font-bold"
          >
            Baixar TXT
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 rounded-xl px-4 py-2 font-bold"
          >
            Fechar relatório
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 report-stats">
        <div className="border rounded-2xl p-3 bg-gray-50"><div className="text-xs text-gray-500">Total</div><div className="text-2xl font-black">{stats.total}</div></div>
        <div className="border rounded-2xl p-3 bg-green-50"><div className="text-xs text-gray-500">Encontradas</div><div className="text-2xl font-black">{stats.owned}</div></div>
        <div className="border rounded-2xl p-3 bg-red-50"><div className="text-xs text-gray-500">Faltando</div><div className="text-2xl font-black">{stats.missing}</div></div>
        <div className="border rounded-2xl p-3 bg-yellow-50"><div className="text-xs text-gray-500">Repetidas</div><div className="text-2xl font-black">{stats.repeated}</div></div>
        <div className="border rounded-2xl p-3 bg-blue-50"><div className="text-xs text-gray-500">Progresso</div><div className="text-2xl font-black">{stats.progress}%</div></div>
      </div>

      <div className="space-y-4">
        {album.map((section) => {
          const have = section.stickers.filter((sticker) => sticker.owned).map((sticker) => sticker.number);
          const missing = section.stickers.filter((sticker) => !sticker.owned).map((sticker) => sticker.number);
          const repeated = section.stickers
            .filter((sticker) => Number(sticker.repeated || 0) > 0)
            .map((sticker) => `${sticker.number} (${sticker.repeated}x)`);
          const groupLabel = section.group === "ESPECIAIS" || section.group === "PROMO" ? section.group : `Grupo ${section.group}`;

          return (
            <section key={`${section.group}-${section.team}-report`} className="border rounded-2xl overflow-hidden report-card">
              <div className="bg-gray-100 border-b p-3 flex justify-between gap-3">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">{groupLabel} · {section.code}</div>
                  <h3 className="text-xl font-black">{section.flag} {section.team}</h3>
                </div>
                <div className="text-right font-black">{have.length}/{section.stickers.length}</div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 p-3 report-columns">
                <div className="rounded-xl p-3 bg-green-50">
                  <h4 className="font-black text-sm uppercase mb-2">Tenho</h4>
                  <p className="text-sm leading-relaxed">{have.length ? have.join(", ") : "Nenhuma"}</p>
                </div>
                <div className="rounded-xl p-3 bg-red-50">
                  <h4 className="font-black text-sm uppercase mb-2">Faltam</h4>
                  <p className="text-sm leading-relaxed">{missing.length ? missing.join(", ") : "Completo"}</p>
                </div>
                <div className="rounded-xl p-3 bg-yellow-50">
                  <h4 className="font-black text-sm uppercase mb-2">Repetidas</h4>
                  <p className="text-sm leading-relaxed">{repeated.length ? repeated.join(", ") : "Nenhuma"}</p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [album, setAlbum] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? normalizeSavedAlbum(JSON.parse(saved)) : createAlbum();
    } catch {
      return createAlbum();
    }
  });

  const [search, setSearch] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [unlockUnmark, setUnlockUnmark] = useState(false);
  const [syncConfig, setSyncConfigState] = useState(() => loadSyncConfig());
  const [syncStatus, setSyncStatus] = useState("");
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(album));
  }, [album]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
  
    return () => {
      listener.subscription.unsubscribe()
    }
  }, []);

  async function saveAlbumOnline() {
    if (!user) {
      alert("Faça login para sincronizar online.")
      return
    }
  
    setSyncing(true)
  
    const { error } = await supabase
      .from("albums")
      .upsert(
        {
          user_id: user.id,
          album,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
  
    setSyncing(false)
  
    if (error) {
      console.error("Erro Supabase:", error)
      alert(`Erro ao salvar online: ${error.message}`)
      return
    }
  
    alert("Álbum salvo online.")
  }

  async function loadAlbumOnline() {
    if (!user) {
      alert('Faça login para baixar o álbum online.')
      return
    }
  
    const { data, error } = await supabase
      .from('albums')
      .select('album')
      .eq('user_id', user.id)
      .single()
  
    if (error) {
      alert('Nenhum álbum online encontrado.')
      console.error(error)
      return
    }
  
    setAlbum(normalizeSavedAlbum(data.album))
    alert('Álbum carregado online.')
  }

  function setSyncConfig(updater) {
    setSyncConfigState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveSyncConfig(next);
      return next;
    });
  }

  const stats = useMemo(() => getStats(album), [album]);

  function toggleSticker(teamIndex, stickerIndex) {
    const currentSticker = album[teamIndex]?.stickers?.[stickerIndex];

    if (!currentSticker) return;

    if (currentSticker.owned && !unlockUnmark) {
      window.alert("Desmarcação bloqueada. Ative o botão 'Liberar desmarcação' para remover uma figurinha marcada.");
      return;
    }

    setAlbum((prev) =>
      prev.map((section, index) => {
        if (index !== teamIndex) return section;

        return {
          ...section,
          stickers: section.stickers.map((sticker, sIndex) =>
            sIndex === stickerIndex ? { ...sticker, owned: !sticker.owned } : sticker
          ),
        };
      })
    );
  }

  function changeRepeated(teamIndex, stickerIndex, value) {
    setAlbum((prev) =>
      prev.map((section, index) => {
        if (index !== teamIndex) return section;

        return {
          ...section,
          stickers: section.stickers.map((sticker, sIndex) =>
            sIndex === stickerIndex
              ? {
                  ...sticker,
                  owned: value > 0 ? true : sticker.owned,
                  repeated: Math.max(0, Number(sticker.repeated || 0) + value),
                }
              : sticker
          ),
        };
      })
    );
  }

  function resetAlbum() {
    const confirmed = window.confirm("Deseja zerar todo o controle do álbum?");
    if (confirmed) setAlbum(createAlbum());
  }

  async function handleImportBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedAlbum = await readBackupFile(file);
      const confirmed = window.confirm("Deseja substituir o álbum atual pelo backup importado?");
      if (confirmed) {
        setAlbum(importedAlbum);
        setSyncStatus("Backup importado com sucesso.");
      }
    } catch {
      window.alert("Arquivo inválido. Selecione um backup JSON exportado pelo app.");
    } finally {
      event.target.value = "";
    }
  }

  async function handlePushSync() {
    try {
      setSyncStatus("Enviando álbum para sincronização online...");
      await pushOnlineSync(album, syncConfig);
      setSyncStatus(`Sincronizado online em ${new Date().toLocaleString("pt-BR")}.`);
    } catch (error) {
      console.error(error);
      setSyncStatus("Não foi possível enviar. Verifique a URL, token, CORS e permissões do endpoint.");
    }
  }

  async function handlePullSync() {
    try {
      const confirmed = window.confirm("Deseja substituir o álbum atual pelos dados online?");
      if (!confirmed) return;

      setSyncStatus("Baixando álbum da sincronização online...");
      const remoteAlbum = await pullOnlineSync(syncConfig);
      setAlbum(remoteAlbum);
      setSyncStatus(`Álbum baixado online em ${new Date().toLocaleString("pt-BR")}.`);
    } catch (error) {
      console.error(error);
      setSyncStatus("Não foi possível baixar. Verifique a URL, token, CORS e o formato do JSON remoto.");
    }
  }

  function openReport() {
    setShowReport(true);
    setTimeout(() => {
      const element = document.getElementById("pdf-report");
      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const filtered = album.filter((section) => {
    const text = `${section.team} ${section.group} ${section.code}`.toLowerCase();
    return text.includes(search.trim().toLowerCase());
  });

  const groupedSections = filtered.reduce((acc, section) => {
    const key = section.group === "ESPECIAIS" || section.group === "PROMO" ? section.group : `Grupo ${section.group}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(section);
    return acc;
  }, {});

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://album-da-copa-xi.vercel.app",
      },
    })
  }
  
  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 app-root">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #pdf-report, #pdf-report * { visibility: visible !important; }
          #pdf-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print { display: none !important; }
          .report-card { break-inside: avoid; page-break-inside: avoid; }
          .report-columns { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .report-stats { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow p-6 mb-6 no-print">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black mb-2">Álbum Copa do Mundo 2026</h1>
              <p className="text-gray-500">Controle de figurinhas encontradas, faltantes e repetidas.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={openReport} className="bg-blue-700 text-white rounded-xl px-4 py-2 font-bold">
                Emitir relatório PDF
              </button>

              <button
                type="button"
                onClick={() => setUnlockUnmark((value) => !value)}
                className={`${unlockUnmark ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"} rounded-xl px-4 py-2 font-bold`}
              >
                {unlockUnmark ? "Desmarcação liberada" : "Liberar desmarcação"}
              </button>

              <button type="button" onClick={resetAlbum} className="bg-red-600 text-white rounded-xl px-4 py-2 font-bold">
                Zerar álbum
              </button>
            </div>
          </div>

          {user ? (
  <>
    <button onClick={saveAlbumOnline} className="bg-purple-700 text-white rounded-xl px-4 py-2 font-bold">
      {syncing ? 'Salvando...' : 'Salvar online'}
    </button>

    <button onClick={loadAlbumOnline} className="bg-indigo-700 text-white rounded-xl px-4 py-2 font-bold">
      Baixar online
    </button>

    <button onClick={logout} className="bg-gray-700 text-white rounded-xl px-4 py-2 font-bold">
      Sair
    </button>
  </>
) : (
  <button onClick={loginWithGoogle} className="bg-green-700 text-white rounded-xl px-4 py-2 font-bold">
    Entrar com Google
  </button>
)}

          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden mt-5 mb-2">
            <div className="h-full bg-green-600" style={{ width: `${stats.progress}%` }} />
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <span>Total: {stats.total}</span>
            <span>Encontradas: {stats.owned}</span>
            <span>Faltando: {stats.missing}</span>
            <span>Repetidas: {stats.repeated}</span>
            <span>Progresso: {stats.progress}%</span>
          </div>
        </div>

        {showReport && <ReportSection album={album} stats={stats} onClose={() => setShowReport(false)} />}

        <ToolsPanel
          album={album}
          stats={stats}
          onImportBackup={handleImportBackup}
          syncConfig={syncConfig}
          setSyncConfig={setSyncConfig}
          onPushSync={handlePushSync}
          onPullSync={handlePullSync}
          syncStatus={syncStatus}
        />

        <div className="bg-white rounded-3xl shadow p-4 mb-6 no-print">
          <input
            type="text"
            placeholder="Buscar seleção, grupo ou sigla. Ex: BRA, FWC, Coca-Cola"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full border rounded-xl p-3"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl shadow p-6 text-gray-500 no-print">Nenhuma seleção ou seção encontrada para a busca atual.</div>
        ) : (
          <div className="space-y-8 no-print">
            {Object.entries(groupedSections).map(([groupName, sections]) => (
              <div key={groupName}>
                <h2 className="text-2xl font-black mb-4">{groupName}</h2>

                <div className="space-y-6">
                  {sections.map((section) => {
                    const originalIndex = album.findIndex((item) => item.team === section.team && item.group === section.group);
                    const owned = section.stickers.filter((sticker) => sticker.owned).length;
                    const repeated = section.stickers.reduce((sum, sticker) => sum + Number(sticker.repeated || 0), 0);
                    const progress = section.stickers.length ? Math.round((owned / section.stickers.length) * 100) : 0;

                    return (
                      <div key={`${section.group}-${section.team}`} className="bg-white rounded-3xl shadow overflow-hidden">
                        <div className="p-5 border-b bg-gray-50">
                          <div className="flex justify-between items-center gap-4">
                            <div>
                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <span>{section.group === "ESPECIAIS" || section.group === "PROMO" ? section.group : `Grupo ${section.group}`}</span>
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">{section.code}</span>
                              </p>

                              <h3 className="text-2xl font-bold flex items-center gap-3 mt-1">
                                <span className="text-3xl">{section.flag}</span>
                                {section.team}
                              </h3>
                            </div>

                            <div className="text-right">
                              <div className="font-bold">{progress}%</div>
                              <div className="text-sm text-gray-500">{owned}/{section.stickers.length}</div>
                              <div className="text-xs text-gray-500">Rep: {repeated}</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
                          {section.stickers.map((sticker, stickerIndex) => (
                            <div
                              key={sticker.number}
                              className={`rounded-2xl border p-3 transition ${
                                sticker.owned ? "bg-green-600 text-white border-green-600" : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <button type="button" className="w-full" onClick={() => toggleSticker(originalIndex, stickerIndex)}>
                                <div className="font-black text-lg">{sticker.number}</div>
                                <div className="text-xs mt-1">
                                  {sticker.owned ? "Encontrada · clique para desmarcar" : "Faltando"}
                                </div>
                              </button>

                              <div className="flex items-center justify-between mt-3 gap-2">
                                <button type="button" onClick={() => changeRepeated(originalIndex, stickerIndex, -1)} className="bg-black/10 px-2 py-1 rounded-lg text-sm">-</button>
                                <span className="text-xs font-bold">Rep: {sticker.repeated}</span>
                                <button type="button" onClick={() => changeRepeated(originalIndex, stickerIndex, 1)} className="bg-black/10 px-2 py-1 rounded-lg text-sm">+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
