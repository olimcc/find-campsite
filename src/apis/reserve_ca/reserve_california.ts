import { DateTime } from 'luxon';
import { makePostRequest } from '../../requests';
import { ICampground, ICampsite } from '../../types';
import * as API from './types';

const API_ENDPOINT = 'https://calirdr.usedirect.com/rdr/rdr/search/grid';
const API_DATE_FORMAT = 'M-d-yyyy';

class Campground implements ICampground {
  constructor(private data: API.Facility) { }

  getName() {
    return this.data.Name;
  }
}

export async function getCampground(campgroundId: string): Promise<Campground | null> {
  const request = {
    FacilityId: Number.parseInt(campgroundId),
    StartDate: '7-1-2020',
    EndDate: '7-2-2020',
  };
  try {
    const response = await makePostRequest<API.GridResponse>(API_ENDPOINT, request);
    return response.data.Facility ? new Campground(response.data.Facility) : null;
  } catch (e) {
    return null;
  }
}

class Campsite implements ICampsite {
  constructor(private data: API.Unit) { }

  getAvailableDates() {
    return Object.entries(this.data.Slices).map(([date, value]) => {
      return {
        date: DateTime.fromISO(date),
        isAvailable: value.IsFree,
      };
    });
  }

  getName() {
    return `${this.data.Name}`;
  }

  getUrl() {
    return `https://www.reservecalifornia.com/CaliforniaWebHome/`;
  }
}

export async function getCampsites(
  campgroundId: string,
  monthsToCheck: number,
): Promise<Campsite[]> {
  const start = DateTime.local().startOf('day');
  const end = start.plus({ months: monthsToCheck });

  const request = {
    FacilityId: campgroundId,
    StartDate: start.toFormat(API_DATE_FORMAT),
    EndDate: end.toFormat(API_DATE_FORMAT),
  };

  let response;
  let attempt = 0;
  const attempts = 4;
  while (attempt < attempts) {
    response = await makePostRequest<API.GridResponse>(API_ENDPOINT, request);
    if ((response.data && response.data.Message.startsWith('Invalid')) || response.status != 200) {
      attempt += 1;
    } else {
      return Object.values(response.data.Facility.Units).map(
        (data) => new Campsite(data as API.Unit),
      );
    }
  }
  throw `getCampsites fetch error:\n${response}`;
}
