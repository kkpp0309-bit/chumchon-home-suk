const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const forms = document.querySelectorAll("form[data-home-suk-form]");
const adminLoginForm = document.querySelector("[data-admin-login]");
const adminLoginButton = document.querySelector("[data-admin-login] button[type='submit']");
const adminPasswordInput = document.querySelector("[data-admin-login] input[name='password']");
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
const scheduleCards = document.querySelectorAll("[data-schedule-card]");
const adminScheduleForm = document.querySelector("[data-admin-schedule-form]");
const adminScheduleStatus = document.querySelector("[data-admin-schedule-status]");
const adminScheduleReset = document.querySelector("[data-admin-schedule-reset]");

const config = window.HOME_SUK_CONFIG || {};
const formEndpoint = (config.formEndpoint || "").trim();
const adminPassword = "baac2024";
const adminSheetUrl = "https://docs.google.com/spreadsheets/d/1Xu0sLbLoSRgrncvejH102CeczsmMahH3pDLNcOOWXBs/edit";
const defaultSchedule = [
  {
    title: "สัปดาห์ที่ 1",
    detail: "ประชาสัมพันธ์ผ่าน LINE OA ผู้นำชุมชน อสม. สหกรณ์ และเครือข่ายในพื้นที่",
  },
  {
    title: "สัปดาห์ที่ 2",
    detail: "เปิดรับแจ้งความประสงค์ นัดหมายล่วงหน้า และลงทะเบียนผู้ขายสินค้า",
  },
  {
    title: "สัปดาห์ที่ 3",
    detail: "ทีม ธ.ก.ส. ลงพื้นที่ให้บริการ พร้อมตลาดสินค้าชุมชน",
  },
  {
    title: "หลังจบงาน",
    detail: "สรุปผลบริการ ยอดนัดหมาย ยอดผู้ขาย และติดตามผลลูกค้า",
  },
];

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

function setAdminScheduleStatus(message, type) {
  if (!adminScheduleStatus) return;
  adminScheduleStatus.textContent = message;
  adminScheduleStatus.dataset.status = type;
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

function normalizeSchedule(items) {
  const source = Array.isArray(items) && items.length ? items : defaultSchedule;
  return defaultSchedule.map((fallback, index) => {
    const item = source[index] || {};
    return {
      title: String(item.title || fallback.title).trim(),
      detail: String(item.detail || fallback.detail).trim(),
    };
  });
}

function renderSchedule(items) {
  const schedule = normalizeSchedule(items);

  scheduleCards.forEach((card, index) => {
    const title = card.querySelector("[data-schedule-title]");
    const detail = card.querySelector("[data-schedule-detail]");
    const item = schedule[index] || defaultSchedule[index];

    if (title) title.textContent = item.title;
    if (detail) detail.textContent = item.detail;
  });

  return schedule;
}

function fillScheduleEditor(items) {
  if (!adminScheduleForm) return;
  const schedule = normalizeSchedule(items);

  schedule.forEach((item, index) => {
    const number = index + 1;
    const titleInput = adminScheduleForm.elements[`title_${number}`];
    const detailInput = adminScheduleForm.elements[`detail_${number}`];

    if (titleInput) titleInput.value = item.title;
    if (detailInput) detailInput.value = item.detail;
  });
}

function collectScheduleEditor() {
  return defaultSchedule.map((fallback, index) => {
    const number = index + 1;
    const titleInput = adminScheduleForm.elements[`title_${number}`];
    const detailInput = adminScheduleForm.elements[`detail_${number}`];

    return {
      title: String(titleInput && titleInput.value ? titleInput.value : fallback.title).trim(),
      detail: String(detailInput && detailInput.value ? detailInput.value : fallback.detail).trim(),
    };
  });
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

  if (data.schedule) {
    const schedule = renderSchedule(data.schedule);
    fillScheduleEditor(schedule);
  }
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
    showAdminEditingTools(defaultSchedule);
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
    showAdminEditingTools(defaultSchedule);
    setAdminStatus("เข้าสู่ระบบ Admin แล้ว แต่ Dashboard โหลดไม่สำเร็จชั่วคราว ยังแก้ไขกำหนดการได้", "success");
  }
}

function showAdminEditingTools(schedule) {
  if (adminDashboard) {
    adminDashboard.hidden = false;
  }

  if (adminSheetLink) {
    adminSheetLink.href = adminSheetUrl;
    adminSheetLink.hidden = false;
  }

  fillScheduleEditor(schedule || defaultSchedule);
}

async function loadPublicSchedule() {
  if (!formEndpoint) {
    renderSchedule(defaultSchedule);
    return;
  }

  try {
    const data = await requestJsonp("schedule", {});

    if (data.ok && data.schedule) {
      renderSchedule(data.schedule);
    } else {
      renderSchedule(defaultSchedule);
    }
  } catch (error) {
    renderSchedule(defaultSchedule);
  }
}

function requestAdminDashboardJsonp() {
  return requestJsonp("dashboard", {
    password: adminPassword,
  });
}

function requestJsonp(action, params, timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    const callbackName = `homeSukCallback_${Date.now()}_${Math.round(Math.random() * 100000)}`;
    const script = document.createElement("script");
    const url = new URL(formEndpoint);

    url.searchParams.set("action", action);
    url.searchParams.set("callback", callbackName);
    url.searchParams.set("_", Date.now().toString());

    Object.keys(params || {}).forEach((key) => {
      url.searchParams.set(key, params[key]);
    });

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Request timeout"));
    }, timeoutMs);

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
      reject(new Error("Request failed"));
    };

    document.body.appendChild(script);
  });
}

loadPublicSchedule();

function handleAdminLogin(event) {
  if (event) {
    event.preventDefault();
  }

  const password = String(adminPasswordInput ? adminPasswordInput.value : "").trim();

  if (password !== adminPassword) {
    setAdminStatus("รหัสผ่านไม่ถูกต้อง", "error");
    return;
  }

  showAdminEditingTools(defaultSchedule);

  if (adminLoginForm) {
    adminLoginForm.hidden = true;
  }

  setAdminStatus("เข้าสู่ระบบ Admin แล้ว เลื่อนลงไปแก้ไขกำหนดการได้เลย", "success");
  loadAdminDashboard();

  window.setTimeout(() => {
    document.querySelector("#admin-schedule-editor")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 350);
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", handleAdminLogin);
}

if (adminLoginButton) {
  adminLoginButton.addEventListener("click", handleAdminLogin);
}

if (adminPasswordInput) {
  adminPasswordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleAdminLogin(event);
    }
  });
}

if (adminRefresh) {
  adminRefresh.addEventListener("click", loadAdminDashboard);
}

if (adminScheduleForm) {
  adminScheduleForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (adminDashboard && adminDashboard.hidden) {
      setAdminScheduleStatus("กรุณาเข้าสู่ระบบ Admin ก่อนแก้ไขกำหนดการ", "error");
      return;
    }

    const schedule = collectScheduleEditor();
    const button = adminScheduleForm.querySelector("button[type='submit']");
    const scheduleParams = {
      password: adminPassword,
    };

    schedule.forEach((item, index) => {
      const number = index + 1;
      scheduleParams[`title_${number}`] = item.title;
      scheduleParams[`detail_${number}`] = item.detail;
    });

    if (button) button.disabled = true;
    setAdminScheduleStatus("กำลังบันทึกกำหนดการ...", "loading");

    try {
      const data = await requestJsonp("saveSchedule", scheduleParams, 60000);

      if (!data.ok) {
        throw new Error(data.error || "Save schedule failed");
      }

      renderSchedule(data.schedule || schedule);
      fillScheduleEditor(data.schedule || schedule);
      setAdminScheduleStatus("บันทึกกำหนดการแล้ว", "success");
    } catch (error) {
      setAdminScheduleStatus("บันทึกกำหนดการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      if (button) button.disabled = false;
    }
  });
}

if (adminScheduleReset && adminScheduleForm) {
  adminScheduleReset.addEventListener("click", () => {
    fillScheduleEditor(defaultSchedule);
    setAdminScheduleStatus("คืนค่าเริ่มต้นแล้ว กดบันทึกกำหนดการเพื่อใช้ค่านี้บนเว็บไซต์", "success");
  });
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
