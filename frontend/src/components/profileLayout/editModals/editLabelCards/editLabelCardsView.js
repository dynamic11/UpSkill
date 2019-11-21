import React, { Component } from "react";
import { injectIntl } from "react-intl";

import EditModalController from "../common/editModal/editModalController.js";
import "./editLabelCards.css";

import LabelCardFormController from "../../../editForms/labelCardForm/labelCardFormController";

class EditLabelCardView extends Component {
  render() {
    return (
      <EditModalController
        {...this.props}
        editOptionPaths={{
          groupOrLevel: "api/option/getGroupLevel",
          security: "api/option/getSecurityClearance",
          tenure: "api/option/getTenure"
        }}
        form={LabelCardFormController}
        name="Edit Info"
      />
    );
  }
}

export default injectIntl(EditLabelCardView);