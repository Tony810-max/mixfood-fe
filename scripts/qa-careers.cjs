// Local browser emulation with synthetic API data; no email or webhook is sent.
const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const output = path.join(require('node:os').tmpdir(), 'mixfood-careers-qa');
const clientUrl = process.env.QA_CLIENT_URL || 'http://127.0.0.1:18080';
const adminUrl = process.env.QA_ADMIN_URL || 'http://127.0.0.1:13000';
const job = { id: 8, position: 'CUSTOM_8', nameVi: 'Lễ tân', nameEn: 'Receptionist', vacancies: 2, isActive: true, createdAt: '2026-11-02T09:00:00Z', employmentTypes: ['PART_TIME', 'FULL_TIME'], salaryAmount: 6000000, salaryUnit: 'MONTH', workingShifts: [
  { employmentType: 'PART_TIME', startTime: '17:00', endTime: '22:00' },
  { employmentType: 'FULL_TIME', startTime: '09:00', endTime: '18:00' },
] };
const adminUser = { id: 1, name: 'QA Admin', email: 'qa@example.com', role: 'ADMIN' };
const employee = { id: 5, name: 'QA Employee', email: 'employee@example.com', phone: '0905123456', role: 'CASHIER', status: 'ACTIVE', createdAt: '2026-11-02T09:00:00Z' };
const results = [];

async function setup(browser, language, admin = false, state = 'normal') {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'lang', value: language === 'vi' ? 'vn' : 'en', url: clientUrl }]);
  if (admin) await context.addInitScript(({ language, adminUser }) => {
    localStorage.setItem('mixfood.access-token', 'synthetic-qa-token');
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    localStorage.setItem('mixfood.admin-language', language);
  }, { language, adminUser });
  const page = await context.newPage();
  let currentJobs = [{ ...job, ...(state === 'long' ? { nameVi: 'Vịtrítuyểndụng'.repeat(7), nameEn: 'LongPosition'.repeat(8) } : {}) }];
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (['fetch', 'xhr'].includes(request.resourceType()) && !url.pathname.startsWith('/_next/')) {
      let data = [];
      let status = 200;
      if (url.pathname === '/recruitment') {
        data = state === 'empty' ? [] : currentJobs; if (state === 'error') status = 503;
        if (request.method() === 'POST') { data = { ...job, ...request.postDataJSON(), id: 9, position: 'CUSTOM_9', workingShifts: [] }; currentJobs = [...currentJobs, data]; }
      }
      if (url.pathname === '/recruitment/admin/all') data = currentJobs;
      if (url.pathname === '/recruitment/applications') data = { id: 123 };
      if (url.pathname === '/users/all') data = { data: [employee], meta: { page: 1, totalPages: 1, total: 1, limit: 10 } };
      if (url.pathname === '/users/profile') data = adminUser;
      if (url.pathname === '/users/5/role') data = { ...employee, role: 'MANAGER' };
      if (url.pathname.startsWith('/recruitment/') && request.method() === 'PATCH') { data = { ...job, ...request.postDataJSON() }; currentJobs = currentJobs.map((item) => item.id === data.id ? data : item); }
      if (url.pathname.includes('dashboard')) data = {};
      return route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' }, body: JSON.stringify(data) });
    }
    if ([new URL(clientUrl).origin, new URL(adminUrl).origin].includes(url.origin)) return route.continue();
    return route.abort();
  });
  return { page, context, errors };
}

async function assertViewport(page, label, errors) {
  const size = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  if (size.content > size.width) throw new Error(`${label}: horizontal overflow ${size.content}/${size.width}`);
  if (errors.length) throw new Error(`${label}: ${errors.join('; ')}`);
  results.push({ label, ...size });
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
}

async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    if (!process.argv.includes('--admin-only')) {
    for (const language of ['en', 'vi']) for (const width of [320, 390, 768, 1440, 1920]) {
      const { page, context, errors } = await setup(browser, language);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${clientUrl}/careers/position-8`, { waitUntil: 'networkidle' });
      await expect(page.getByRole('heading', { level: 1 })).toContainText(language === 'en' ? 'Receptionist' : 'Lễ tân');
      await expect(page.getByText(/09:00.*18:00/)).toBeVisible();
      await assertViewport(page, `client careers ${language} ${width}`, errors);
      if ([390, 1440].includes(width)) {
        await page.locator('#ung-tuyen').scrollIntoViewIfNeeded();
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: path.join(output, `client-careers-${language}-${width}.png`), fullPage: true, animations: 'disabled' });
      }
      await page.goto(clientUrl, { waitUntil: 'networkidle' });
      const section = page.locator('#specialties');
      const buttons = section.getByRole('button');
      await buttons.nth(1).click();
      await buttons.nth(2).hover();
      await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true');
      await expect(section.getByRole('link').last()).toHaveAttribute('href', '/menu?q=Pad%20Thai');
      await assertViewport(page, `client home ${language} ${width}`, errors);
      await context.close();
    }

    for (const state of ['empty', 'error']) {
      const { page, context } = await setup(browser, 'en', false, state);
      await page.goto(`${clientUrl}/careers`, { waitUntil: 'networkidle' });
      await expect(state === 'error' ? page.getByRole('alert') : page.getByRole('heading', { name: /no.*(open|position|vacanc)|not.*hiring/i })).toBeVisible();
      results.push({ label: `client careers ${state}` });
      await context.close();
    }

    }

    for (const language of ['en', 'vi']) for (const width of [320, 390, 768, 1440, 1920]) {
      const { page, context, errors } = await setup(browser, language, true);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${adminUrl}/?view=recruitment`, { waitUntil: 'networkidle', timeout: 120000 });
      await expect(page.getByRole('heading', { name: language === 'en' ? 'Receptionist' : 'Lễ tân', exact: true })).toBeVisible();
      await expect(page.locator('input[type="time"]')).toHaveCount(4);
      await assertViewport(page, `admin recruitment ${language} ${width}`, errors);
      if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `admin-careers-${language}-${width}.png`), fullPage: true });
      await context.close();
    }

    const { page, context } = await setup(browser, 'en', true);
    await page.goto(`${adminUrl}/?view=recruitment`, { waitUntil: 'networkidle' });
    const patch = page.waitForRequest((request) => request.method() === 'PATCH' && new URL(request.url()).pathname === '/recruitment/8');
    await page.locator('input[type="time"]').first().fill('16:30');
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    const payload = (await patch).postDataJSON();
    if (payload.workingShifts[0].startTime !== '16:30' || payload.workingShifts[1].startTime !== '09:00') throw new Error('Independent shifts were not preserved');
    const creation = page.locator('form').last();
    await creation.getByLabel('Position name (Vietnamese)').fill('Lễ tân ca tối');
    await creation.getByLabel('Position name (English)').fill('Evening receptionist');
    const createRequest = page.waitForRequest((request) => request.method() === 'POST' && new URL(request.url()).pathname === '/recruitment');
    await creation.getByRole('button', { name: 'Add', exact: true }).click();
    const created = (await createRequest).postDataJSON();
    if (created.nameEn !== 'Evening receptionist' || created.nameVi !== 'Lễ tân ca tối' || created.isActive !== false) throw new Error('Incorrect custom position creation payload');
    await expect(page.getByRole('heading', { name: 'Evening receptionist', exact: true })).toBeVisible();
    await page.goto(`${adminUrl}/?view=employees`, { waitUntil: 'networkidle' });
    await expect(page.getByText('QA Employee', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /actions/i }).last().click();
    await page.getByRole('menuitem', { name: 'Change to manager' }).click();
    const roleUpdate = page.waitForRequest((request) => new URL(request.url()).pathname === '/users/5/role');
    await page.getByRole('alertdialog').getByRole('button', { name: 'Confirm', exact: true }).click();
    if ((await roleUpdate).postDataJSON().role !== 'MANAGER') throw new Error('Incorrect employee role payload');
    results.push({ label: 'admin independent shift update and employee role confirmation' });
    await context.close();

    for (const admin of [false, true]) for (const width of [320, 390, 768, 1440]) {
      const { page, context, errors } = await setup(browser, 'en', admin, 'long');
      await page.setViewportSize({ width, height: 900 });
      await page.goto(admin ? `${adminUrl}/?view=recruitment` : `${clientUrl}/careers/position-8`, { waitUntil: 'networkidle' });
      await expect(page.getByRole('heading', { name: /LongPosition/ }).first()).toBeVisible();
      await assertViewport(page, `${admin ? 'admin' : 'client'} long names ${width}`, errors);
      await context.close();
    }
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ passed: results.length, output }));
  } finally { await browser.close(); }
}
module.exports = { setup };
if (require.main === module) run().catch((error) => { console.error(error.message); process.exitCode = 1; });
