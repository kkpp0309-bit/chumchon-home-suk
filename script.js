const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const forms = document.querySelectorAll("form[data-home-suk-form]");
const adminLoginForm = document.querySelector("[data-admin-login]");
const adminDashboard = document.querySelector("[data-admin-dashboard]");
const adminStatus = document.querySelector("[data-admin-status]");
const adminStats = document.querySelector("[data-admin-stats]");
const adminSummary = document.querySelector("[data-admin-summary]");
const adminRecent = document.querySelector("[data-admin-recent]");
const adminUpdated = document.querySelector("[data-admin-updated]");
const adminRefresh = document.querySelector("[data-admin-refresh]");
const adminDownloadPdf = document.querySelector("[data-admin-download-pdf]");
const adminSheetLink = document.querySelector("[data-admin-sheet-link]");
const adminChartTotals = document.querySelector("[data-admin-chart-totals]");
const adminChartStatus = document.querySelector("[data-admin-chart-status]");
const adminChartToday = document.querySelector("[data-admin-chart-today]");

const config = window.HOME_SUK_CONFIG || {};
const formEndpoint = (config.formEndpoint || "").trim();
const adminPassword = "baac2024";
const adminSheetUrl = "https://docs.google.com/spreadsheets/d/1Xu0sLbLoSRgrncvejH102CeczsmMahH3pDLNcOOWXBs/edit";

if (year) {
  year.textContent = new Date().getFullYear();
}

function setHeaderState() {
  if (!header) return;
  header.dataset.elevated = String(window.scrollY > 8);
}

function setFormStatus(form, message, type) {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;
  status.textContent = message;
  status.dataset.status = type;
}

function setFormBusy(form, isBusy) {
  const button = form.querySelector("button[type='submit']");
  if (!button) return;
  button.disabled = isBusy;
  button.dataset.originalText ||= button.textContent;
  button.textContent = isBusy ? "กำลังส่งข้อมูล..." : button.dataset.originalText;
}

function formDataToObject(form) {
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = typeof value === "string" ? value.trim() : value;
  }

  return data;
}

async function submitHomeSukForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;

  if (!form.reportValidity()) return;

  if (!formEndpoint) {
    setFormStatus(
      form,
      "ระบบรับข้อมูลยังไม่ได้ตั้งค่า กรุณาติดต่อเจ้าหน้าที่หรือแอดมิน LINE OA",
      "error",
    );
    return;
  }

  const payload = {
    formType: form.dataset.homeSukForm,
    formTitle: form.dataset.formTitle || form.name,
    submittedAt: new Date().toISOString(),
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
    data: formDataToObject(form),
  };

  setFormBusy(form, true);
  setFormStatus(form, "กำลังส่งข้อมูลให้เจ้าหน้าที่...", "loading");

  try {
    await fetch(formEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    form.reset();
    setFormStatus(
      form,
      "ส่งข้อมูลแล้ว เจ้าหน้าที่จะตรวจสอบและติดต่อกลับตามช่องทางที่แจ้งไว้",
      "success",
    );
  } catch (error) {
    setFormStatus(
      form,
      "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือแจ้งแอดมิน LINE OA",
      "error",
    );
  } finally {
    setFormBusy(form, false);
  }
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "ปิดเมนู" : "เปิดเมนู");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "เปิดเมนู");
    }
  });
}

forms.forEach((form) => {
  form.addEventListener("submit", submitHomeSukForm);
});

function setAdminStatus(message, type) {
  if (!adminStatus) return;
  adminStatus.textContent = message;
  adminStatus.dataset.status = type;
}

function formatNumber(value) {
  return new Intl.NumberFormat("th-TH").format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(date);
}

function textCell(value) {
  return String(value || "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderAdminDashboard(data) {
  const totals = data.totals || {};
  const totalNew = Number(totals.serviceNew || 0) + Number(totals.appointmentNew || 0) + Number(totals.sellerNew || 0);

  if (adminStats) {
    adminStats.innerHTML = [
      ["serviceTotal", "ขอรับบริการทั้งหมด"],
      ["appointmentTotal", "นัดหมายทั้งหมด"],
      ["sellerTotal", "ผู้ขายทั้งหมด"],
      ["newTotal", "งานใหม่ทั้งหมด"],
    ].map(([key, label]) => {
      const value = key === "newTotal" ? totalNew : totals[key];
      return `<article><span>${formatNumber(value)}</span><p>${label}</p></article>`;
    }).join("");
  }

  if (adminSummary) {
    const rows = [
      ["ขอรับบริการ", totals.serviceTotal, totals.serviceNew, totals.serviceToday],
      ["นัดหมาย", totals.appointmentTotal, totals.appointmentNew, totals.appointmentToday],
      ["ผู้ขาย", totals.sellerTotal, totals.sellerNew, totals.sellerToday],
    ];

    adminSummary.innerHTML = rows.map((row) => `
      <tr>
        <td>${row[0]}</td>
        <td>${formatNumber(row[1])}</td>
        <td>${formatNumber(row[2])}</td>
        <td>${formatNumber(row[3])}</td>
      </tr>
    `).join("");
  }

  if (adminRecent) {
    const recent = data.recent || [];
    adminRecent.innerHTML = recent.length
      ? recent.map((item) => `
        <tr>
          <td>${formatDateTime(item.submittedAt)}</td>
          <td>${textCell(item.type)}</td>
          <td>${textCell(item.primary)}</td>
          <td>${textCell(item.status)}</td>
        </tr>
      `).join("")
      : '<tr><td colspan="4">ยังไม่มีข้อมูลล่าสุด</td></tr>';
  }

  if (adminUpdated) {
    adminUpdated.textContent = `อัปเดตล่าสุด: ${formatDateTime(data.updatedAt)}`;
  }

  if (adminSheetLink) {
    const sheetUrl = data.spreadsheetUrl || adminSheetUrl;
    if (sheetUrl) {
      adminSheetLink.href = sheetUrl;
      adminSheetLink.hidden = false;
    } else {
      adminSheetLink.hidden = true;
    }
  }

  renderAdminCharts(data, totalNew);
}

function renderBarChart(container, rows) {
  if (!container) return;
  const max = Math.max(...rows.map((row) => Number(row.value || 0)), 1);

  container.innerHTML = rows.map((row) => {
    const value = Number(row.value || 0);
    const width = Math.max((value / max) * 100, value > 0 ? 4 : 0);

    return `
      <div class="bar-row">
        <span class="bar-label">${textCell(row.label)}</span>
        <span class="bar-track"><span class="bar-fill" style="width: ${width}%"></span></span>
        <span class="bar-value">${formatNumber(value)}</span>
      </div>
    `;
  }).join("");
}

function renderAdminCharts(data, totalNew) {
  const totals = data.totals || {};
  const status = data.statusTotals || {};
  const totalAll = Number(totals.serviceTotal || 0) + Number(totals.appointmentTotal || 0) + Number(totals.sellerTotal || 0);
  const inProgress = Number(status.inProgress || 0) + Number(status.appointed || 0) + Number(status.followUp || 0);
  const done = Number(status.done || 0);
  const other = Math.max(totalAll - totalNew - inProgress - done, 0);

  renderBarChart(adminChartTotals, [
    { label: "ขอรับบริการ", value: totals.serviceTotal },
    { label: "นัดหมาย", value: totals.appointmentTotal },
    { label: "ผู้ขาย", value: totals.sellerTotal },
  ]);

  renderBarChart(adminChartToday, [
    { label: "ขอรับบริการ", value: totals.serviceToday },
    { label: "นัดหมาย", value: totals.appointmentToday },
    { label: "ผู้ขาย", value: totals.sellerToday },
  ]);

  if (adminChartStatus) {
    const newDeg = totalAll ? (totalNew / totalAll) * 360 : 0;
    const progressDeg = totalAll ? (inProgress / totalAll) * 360 : 0;
    const doneDeg = totalAll ? (done / totalAll) * 360 : 0;

    adminChartStatus.innerHTML = `
      <div class="donut-chart" data-total="${formatNumber(totalAll)}" style="--new: ${newDeg}deg; --progress: ${progressDeg}deg; --done: ${doneDeg}deg"></div>
      <div class="status-legend">
        <p><span><i class="legend-dot legend-new"></i>ใหม่</span><strong>${formatNumber(totalNew)}</strong></p>
        <p><span><i class="legend-dot legend-progress"></i>กำลังดำเนินการ/นัดหมาย/รอติดตาม</span><strong>${formatNumber(inProgress)}</strong></p>
        <p><span><i class="legend-dot legend-done"></i>เสร็จสิ้น</span><strong>${formatNumber(done)}</strong></p>
        <p><span><i class="legend-dot legend-other"></i>อื่น ๆ</span><strong>${formatNumber(other)}</strong></p>
      </div>
    `;
  }
}

async function loadAdminDashboard() {
  if (!formEndpoint) {
    setAdminStatus("ยังไม่ได้ตั้งค่า URL หลังบ้าน", "error");
    return;
  }

  setAdminStatus("กำลังโหลด Dashboard...", "loading");

  try {
    const data = await requestAdminDashboardJsonp();

    if (!data.ok) {
      throw new Error(data.error || "โหลดข้อมูลไม่สำเร็จ");
    }

    renderAdminDashboard(data);
    setAdminStatus("โหลด Dashboard แล้ว", "success");
  } catch (error) {
    setAdminStatus("โหลด Dashboard ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
  }
}

function requestAdminDashboardJsonp() {
  return new Promise((resolve, reject) => {
    const callbackName = `homeSukDashboard_${Date.now()}_${Math.round(Math.random() * 100000)}`;
    const script = document.createElement("script");
    const url = new URL(formEndpoint);

    url.searchParams.set("action", "dashboard");
    url.searchParams.set("password", adminPassword);
    url.searchParams.set("callback", callbackName);

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Dashboard request timeout"));
    }, 15000);

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.src = url.toString();
    script.onerror = () => {
      cleanup();
      reject(new Error("Dashboard request failed"));
    };

    document.body.appendChild(script);
  });
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = new FormData(adminLoginForm).get("password");

    if (password !== adminPassword) {
      setAdminStatus("รหัสผ่านไม่ถูกต้อง", "error");
      return;
    }

    adminDashboard.hidden = false;
    setAdminStatus("เข้าสู่ระบบ Admin แล้ว", "success");
    loadAdminDashboard();
  });
}

if (adminRefresh) {
  adminRefresh.addEventListener("click", loadAdminDashboard);
}

if (adminDownloadPdf) {
  adminDownloadPdf.addEventListener("click", () => {
    if (adminDashboard && adminDashboard.hidden) {
      setAdminStatus("กรุณาเข้าสู่ระบบ Admin ก่อนดาวน์โหลด PDF", "error");
      return;
    }

    document.title = "รายงาน Dashboard ชุมชนโฮมสุข";
    window.print();
  });
}
