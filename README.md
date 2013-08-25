## Teseda Website - Development Setup
*Prerequisites: Primordial Drive and [NodeJS](http://nodejs.org/download/) ~v0.8.15*

### Step 1: Install

	./scripts/setup.sh

*Note: This will ask you for your `Password:`*

After entering, please be patient…the script with clear your npm and bower cache, then install the goods. Primarily node modules and bower components to get you going.

### Step 2: You are now ready.

	grunt go


### Problems with Setup?

It is possible that npm and/or bower may need a cache clear. If you are experiencing problems trying to run `grunt swing`, then try this:

    sudo npm cache clean

And now try cleansing bower as well:

    sudo bower cache-clean
