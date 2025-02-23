// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IDS } from '../common/config';
import { test } from './fixture';
import { dataUiId, loadUrlInPage, stubMessageTimestamps, waitForChatCompositeToLoad } from '../common/utils';
import { Page, expect } from '@playwright/test';

// All tests in this suite *must be run sequentially*.
// The tests are not isolated, tests may depend on the final-state of the chat thread after previous tests.
//
// We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
// many threads using the same connection string in a short span of time.
test.describe('ErrorBar is shown correctly', async () => {
  test('not shown when nothing is wrong', async ({ serverUrl, users, page }) => {
    await loadUrlInPage(page, serverUrl, users[0]);
    page.bringToFront();
    await waitForChatCompositeToLoad(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-valid-user.png');

    await sendAMessage(page);
    await waitForSendSuccess(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-send-message-with-valid-user.png');
  });

  test('with wrong thread ID', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.threadId = 'INCORRECT_VALUE';
    await loadUrlInPage(page, serverUrl, users[0]);
    await waitForChatCompositeToLoad(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-thread-id.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-wrong-thread-id.png');
  });

  test('with expired token', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.token = 'INCORRECT_VALUE' + user.token;
    await loadUrlInPage(page, serverUrl, users[0]);
    await waitForChatCompositeToLoad(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-expired-token.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-expired-token.png');
  });

  test('with wrong endpoint', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.endpointUrl = 'https://INCORRECT.VALUE';
    await loadUrlInPage(page, serverUrl, users[0]);
    await waitForChatCompositeToLoad(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-endpoint-url.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-wrong-endpoint-url.png');
  });
});

const sendAMessage = async (page: Page): Promise<void> => {
  await page.type(dataUiId(IDS.sendboxTextfield), 'No, sir, this will not do.');
  await page.keyboard.press('Enter');
};

const waitForSendFailure = async (page: Page): Promise<void> => {
  await page.waitForSelector(`[data-ui-status="failed"]`);
};

const waitForSendSuccess = async (page: Page): Promise<void> => {
  await page.waitForSelector(`[data-ui-status="delivered"]`);
};
