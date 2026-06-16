const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const forms = document.querySelectorAll("form[data-home-suk-form]");

const config = window.HOME_SUK_CONFIG || {};
const formEndpoint = (config.formEndpoint || "").trim();

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
