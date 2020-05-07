import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: string;
  pointsReceived: string;
  percentage: number;
  grade: string;
}
@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<any> = [];
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
      this.tests = tests;
    } else {

      this.tests = await this.loadTestsFromJson();
    }
    console.log('this.tests from ngOninit...', this.tests);
  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null
    };
    this.tests.unshift(test);
    this.saveToLocalStorage();
  }

  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

saveToLocalStorage() {
  localStorage.setItem('tests', JSON.stringify(this.tests));
}

computegrade() {
  console.log('from computegrade....');
  const data = this.calculate();
  this.router.navigate(['home', data]);
}

calculate() {
  let grade = 0;
  for (let i = 0; i < this.tests.length; i++) {
    console.log('i--->', i 'this.tests[i]', this.tests[i]);
    grade += this.tests[i].grade;
    console.log('grade---->', grade);
  }
  return {
    numberOfTests: this.tests.length,
    pointsPossible: grade,
    pointsReceived: grade,
    percentage: grade,
  };
}

}
