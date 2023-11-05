/* eslint-disable no-mixed-spaces-and-tabs */
const uuid = prefix => (
	prefix
        + 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        // eslint-disable-next-line no-bitwise
        	const r = (Math.random() * 15) | 0;
        	// eslint-disable-next-line no-bitwise
        	const v = c === 'x' ? r : (r & 0x3) | 0x8;
        	return v.toString(15);
        })
);

module.exports = {
	uuid,
};
