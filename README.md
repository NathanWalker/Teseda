## Teseda website
---

### Development Setup
*Prerequisites: [NodeJS](http://nodejs.org/download/) ~v0.8.15*
	
### Step 1: Install

	sudo ./scripts/install.sh
		
### Step 2: You are now ready. Go!

	grunt go


## Testing

### Develop awesomeness and test it, period.
##### Why Test? 

*To make sure you did not break stuff, duh!*

### Testing How-To
We use [Karma](http://karma-runner.github.io/0.8/index.html) to make our code quality spectacular.

> Things should be simple. We believe in testing and so we wanna make it as simple as possible.

Brief overview, the three major types:

> Unit Testing: 

> Isolates small "units" of code so that it can be tested from every angle.

> E2E (End-to-End) Testing:

> Tests full areas of the application by running a test through its entire stack of operations against a special HTTP server from the start to the end (hence end to end). Think about E2E tests as a robot using a browser to run a test and then running an assertion against the page once it's ready. Basically, E2E is just about the same idea as you refreshing your page and saying "It should say home somewhere" or "it should repeat this list five times".

> Midway Testing:

> When Unit testing your application it sometimes may get too complicated when you want to test a application-level operation (like a page loading or XHR request) because you will need to use interceptors and mocks to make requests and templating work (basically anything XHR'ish). E2E testing may not also be the best option because it may be too high level to capture to test for certain features. For example, how do you test a controller on your website that performs a XHR request which downloads the user's session details on every page? ... You can't test this with E2E (since it's difficult to access scope members and application-level JavaScript code) and Unit testing requires lots of mocking and fake data which results in more code and more complexity for your tests. This is where midway testing fits in.




There are several options on how to test:


* Option 1: *Run entire testing suite and look at results*

		grunt test
	


#### If failures are present, fix them. When in doubt, communicate well with other developers about the failure in question.

* Option 2: *Run individual test suites depending on what you want to look at*

	* Unit Tests:
	
			grunt test:unit
	
	* e2e Tests:
	
			grunt test:e2e
			
	* Midway Tests:
	
			grunt test:midway
			
* Option 3:  *Run a live testing workflow  and be a bad ass* (**all tests**)
		
	> *Live Testing: Allows you to make changes and see immediate test results as you develop.
	
		./scripts/test_server.sh
			
	In different tab:
	
		./scripts/test_all.sh
			
* Option 4:  *Run a live testing workflow and get into your unit* (**units only**)
	
		./scripts/test_server.sh
			
	In different tab:
	
		./scripts/test_unit.sh
			
* Option 5:  *Run a live testing workflow and integrate* (**e2e only**)
	
		./scripts/test_server.sh
			
	In different tab:
	
		./scripts/test_e2e.sh
			
* Option 6:  *Run a live testing workflow and be a middle man* (**midway only**)
	
		./scripts/test_server.sh
			
	In different tab:
	
		./scripts/test_midway.sh




	

	
