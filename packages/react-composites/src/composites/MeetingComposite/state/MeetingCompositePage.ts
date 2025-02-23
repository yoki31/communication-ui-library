// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallCompositePage } from '../../CallComposite';

/**
 * Page state the Meeting composite could be in.
 *
 * @alpha
 */
export type MeetingCompositePage = 'configuration' | 'meeting' | 'error' | 'errorJoiningTeamsMeeting' | 'removed';

/**
 * @private
 */
export function callPageToMeetingPage(page: CallCompositePage): MeetingCompositePage {
  return page === 'call' ? 'meeting' : page;
}

/**
 * @private
 */
export function meetingPageToCallPage(page: MeetingCompositePage): CallCompositePage {
  return page === 'meeting' ? 'call' : page;
}
