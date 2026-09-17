export default {
  spec_dir: "../tests",
  spec_files: [
    "**/*[sS]pec.?(m)js"
  ],
  helpers: [],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true
  }
};