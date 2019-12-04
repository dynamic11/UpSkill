import React, { Component } from "react";
import axios from "axios";
import { formatOptions } from "../editForms/common/formTools";
import queryString from "query-string";
import { injectIntl } from "react-intl";
import config from "../../config";
import FormManagingComponent from "../editForms/common/formTools";

import SearchFormView from "./searchFormView";

const backendAddress = config.backendAddress;

/**
 * A form for creating a search query
 *
 * PROPS:                   DEFAULT VALUE:          DESCRIPTION:
 * advancedFieldWidth       400px                   The width to use for advanced fields
 * departments              []                      Array of department options
 * intl                     N/A                     provided by react-intl
 * invertLabels             false                   Whether to invert the label text of form fields
 * jobTitles                []                      Array of job title options
 * locations                []                      Array of location options
 * primaryFieldWidth        800px                   The width to use for the primary skills dropdown
 * securityClearances       []                      Array of security clearance options
 * showAdvancedFields       true                    Whether or not to show advanced options or just skills
 * skills                   []                      Array of skill options
 * updateSearch             []                      Function to call to update the search query
 */
class SearchFormController extends Component {
  constructor(props) {
    super(props);
    const { defaultAdvanced } = this.props;
    this.fields = {};

    this.state = { advancedOptions: null, advancedSearch: defaultAdvanced };

    if (defaultAdvanced) {
      this.getAdvancedOptions();
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  async getAdvancedOptions() {
    let advancedOptions = {
      groupOrLevel: formatOptions(
        (await axios.get(backendAddress + "api/option/getGroupLevel")).data
      ),
      developmentalGoals: formatOptions(
        (
          await axios.get(
            "http://localhost:8080/api/option/getDevelopmentalGoals"
          )
        ).data
      ),
      location: formatOptions(
        (await axios.get(backendAddress + "api/option/getLocation")).data
      )
    };

    this.setState({ advancedOptions: advancedOptions });
  }

  handleChange(e, { name, value, checked }) {
    this.fields[name] = value || checked;
  }

  handleSubmit() {
    const { redirectFunction } = this.props;

    let query;
    console.log("submit", this.fields);
    if (this.state.advancedSearch) {
      delete this.fields.fuzzySearch;
      query = queryString.stringify(this.fields);
    } else {
      query = queryString.stringify({
        searchValue: this.fields.searchValue
      });

      redirectFunction("/secured/results/fuzzySearch?" + encodeURI(query));
    }
    redirectFunction("/secured/results?" + encodeURI(query));
  }

  handleToggle() {
    this.setState({
      advancedSearch: !this.state.advancedSearch
    });
  }

  render() {
    const {
      advancedOptions,
      advancedSearch,
      maxFormWidth,
      horizontalLayout,
      toggleButton
    } = this.props;

    return (
      <SearchFormView
        advancedOptions={advancedOptions}
        maxFormWidth={maxFormWidth}
        advancedSearch={this.state.advancedSearch}
        horizontalLayout={horizontalLayout}
        handleToggle={toggleButton ? this.handleToggle : null}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        maxFormWidth={maxFormWidth}
      />
    );
  }
}

/*
              color="blue"
              id="searchButton"
              onClick={performSearch}
              style={styles.button}
            >
              <FormattedMessage id="search.button.text" />
            </Button>
            <Button
              basic
              color="blue"
              id="toggleAdvancedButton"
              onClick={() => redirectFunction(typeButtonURL)}
              style={styles.button}
*/

SearchFormController.defaultProps = {
  advancedFieldWidth: "400px",
  departments: [
    { key: "department1", text: "department1", value: "department1" },
    { key: "department2", text: "department2", value: "department2" }
  ],
  invertLabels: false,
  jobTitles: [
    { key: "Job1", text: "Job1", value: "Job1" },
    { key: "Job2", text: "Job2", value: "Job2" }
  ],
  locations: [
    { key: "locations1", text: "locations1", value: "locations1" },
    { key: "locations2", text: "locations2", value: "locations2" }
  ],
  primaryFieldWidth: "800px",
  securityClearances: [
    {
      key: "securityClearances1",
      text: "securityClearances1",
      value: "securityClearances1"
    },
    {
      key: "securityClearances2",
      text: "securityClearances2",
      value: "securityClearances2"
    }
  ],
  showAdvancedFields: true
};

export default injectIntl(SearchFormController);
