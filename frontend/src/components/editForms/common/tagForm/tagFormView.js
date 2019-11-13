import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Dropdown, Form, Label } from "semantic-ui-react";
import FormButtonsController from "../formButtons/formButtonsController";
import { generateCommonProps } from "../formTools";
//import "./editTagFormModal.css";

class EditTagFormView extends Component {
  constructor(props) {
    super(props);

    this.generateCommonProps = generateCommonProps.bind(this, this.props);
  }

  render() {
    const {
      dropdownName,
      handleApply,
      handleChange,
      onSubmit,
      handleCancle,
      handleNext,
      handlePrevious,
      tooManyItems,
      profileInfo,
      handleRegister,
      editProfileOptions,
      intl,
      fields
    } = this.props;
    return (
      <React.Fragment>
        {tooManyItems && (
          <Label pointing="below">
            You have selected too many items from this dropdown.
          </Label>
        )}
        <Dropdown
          className="editTagFormDropdown"
          fluid
          multiple
          search
          label={intl.formatMessage({
            id:
              "profile." + dropdownName.replace(/([A-Z])/g, ".$1").toLowerCase()
          })}
          name={dropdownName}
          onChange={handleChange}
          options={editProfileOptions[dropdownName]}
          defaultValue={profileInfo[dropdownName] || []}
        />

        <FormButtonsController
          handleRegister={handleRegister}
          handleApply={onSubmit}
          handleCancle={handleCancle}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      </React.Fragment>
    );
  }
}
/*if (dropdownControl) { editProfileOptions[dropdownName]
  commonProps.options = editProfileOptions[name];
  commonProps.defaultValue = profileInfo[name];
  commonProps.placeholder = null;
} else 


          <Dropdown
            className="editTagFormDropdown"
            fluid
            multiple
            search
            label={intl.formatMessage({
              id:
                "profile." +
                dropdownName.replace(/([A-Z])/g, ".$1").toLowerCase()
            })}
            name={dropdownName}
            onChange={handleChange}
            options={[
              { key: "aa", description: "aa", text: "aa" },
              { key: "bb", description: "bb", text: "bb" },
              { key: "cc", description: "cc", text: "cc" }
            ]}
            defaultValue={["aa"]}
            placeholder={null}
          />


*/

export default injectIntl(EditTagFormView);
