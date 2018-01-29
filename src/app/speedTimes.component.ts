import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-speed-times',
    styleUrls: ['./speedTimes.component.css'],
    template: `
    <div *ngIf="displayData">
        <table>
            <tr>
                <td colspan="3">Base Information</td>
                <td [colSpan]="sipValues.length">Speed Increase Percentage</td>
                <td [colSpan]="sipValues.length">Miles needed to drive to save {{milesNeededTime}} minutes</td>
            </tr>
            <tr>
                <td>MPH</td>
                <td>MPM</td>
                <td>Time for 60 miles</td>
                <td class="sip" *ngFor="let value of sipValues">{{value}}</td>
                <td class="milesNeeded" *ngFor="let value of milesNeededValues">{{value}}</td>
            </tr>
            <tr *ngFor="let entry of displayData">
                <td>{{entry['mph']}}</td>
                <td>{{entry['mpm']}}</td>
                <td>{{entry['sixtyMiles']}}</td>
                <td class="sip" *ngFor="let sip of entry['sip']">{{sip['perc']}}</td>
                <td class="milesNeeded" *ngFor="let miles of entry['milesNeeded']">{{miles['miles']}}</td>
            </tr>
        </table>
    </div>
    `
})
export class SpeedTimesComponent implements OnInit {
    displayData: Object[];
    // Miles Per Hour
    mphLow: number;
    mphHigh: number;
    mphInc: number;
    // Speed Increase Percent
    sipLow: number;
    sipHigh: number;
    sipInc: number;
    sipValues: number[]; // seperated for TD header display purposes
    // Miles needed to drive to save time
    milesNeededLow: number;
    milesNeededHigh: number;
    milesNeededInc: number;
    milesNeededTime: number;
    milesNeededValues: number[]; // seperated for TD header display purposes

    constructor() {
        // Miles Per Hour
        this.mphLow = 5;
        this.mphHigh = 120;
        this.mphInc = 5;
        // Speed Increase Percent
        this.sipLow = 5;
        this.sipHigh = 50;
        this.sipInc = 5;
        this.sipValues = this.generateValueArray(
            this.sipLow,
            this.sipHigh,
            this.sipInc
        );
        // Miles needed to drive to save time
        this.milesNeededLow = 5;
        this.milesNeededHigh = 50;
        this.milesNeededInc = 5;
        this.milesNeededTime = 5;
        this.milesNeededValues = this.generateValueArray(
            this.milesNeededLow,
            this.milesNeededHigh,
            this.milesNeededInc
        );
    }

    ngOnInit() {
        this.generateSpeeds();
    }

    generateValueArray(low: number, high: number, inc: number): number[] {
        const result: number[] = [];
        for (let i = low; i <= high; i += inc) {
            result.push(i);
        }
        return result;
    }

    generateSpeeds(): void {
        this.displayData = [];
        for (let i = this.mphLow; i <= this.mphHigh; i += this.mphInc) {
            const entry = {
                'mph': i,
                'mpm': Math.round((i / 60) * 1000) / 1000,
                'sixtyMiles': Math.round(60 / (i / 60)),
                'sip': this.generateSpeedIncreasePerc(i, this.sipValues),
                'milesNeeded': this.generateMilesNeeded(i, this.milesNeededValues, this.milesNeededTime)
            };
            this.displayData.push(entry);
        }
    }

    generateSpeedIncreasePerc(mph: number, values: number[]): Object[] {
        const sipResult: Object[] = [];
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            sipResult.push({
                'speedIncrease': value,
                'perc': Math.round((value / mph) * 100)
            });
        }
        return sipResult;
    }

    generateMilesNeeded(mph: number, values: number[], time: number): Object[] {
        /*
        calculates how many miles you have to drive
        at the increased speed to save a certain amount of minutes
        example:
        10mph vs increasing by 5mph to 15mph
        How many miles do we need to drive to save 5 minutes by increasing the speed?
        10mph = 1/6 mpm = y
        15mph = 1/4 mpm = z
        5 minutes = t
        x = miles needed to drive
        x/y = (x/z)+t
        or
        x = (tyz)/(z-y)
        */
        const milesNeededResult: Object[] = [];
        const y = mph / 60;
        const t = time;
        for (let i = 0; i < values.length; i++) {
            const speedIncrease = values[i];
            const z = (mph + speedIncrease) / 60;
            const x = (t * y * z) / (z - y);
            milesNeededResult.push({
                'speedIncrease': speedIncrease,
                'miles': Math.round(x * 100) / 100
            });
        }
        return milesNeededResult;
    }
}
