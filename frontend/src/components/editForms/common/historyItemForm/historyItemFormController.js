import React, { Component } from "react";

import FieldManagingComponent from "../formTools";

import HistoryItemFormView from "./historyItemFormView";
import moment from "moment";

export default class HistoryItemFormController extends FieldManagingComponent {
  constructor(props) {
    super(props);

    const { item } = this.props;

    this.onChangeFuncs["isOngoing"] = () => this.forceUpdate();
    this.tempFields["isOngoing"] = Boolean(
      item.isOngoing || (!item.endDate && item.startDate)
    );

    if (item.startDate) {
      const startMoment = moment(item.startDate);
      this.tempFields["startDateMonth"] = parseInt(startMoment.format("M"));
      this.tempFields["startDateYear"] = parseInt(startMoment.format("YY"));
    } else {
      this.tempFields["startDateMonth"] = null;
      this.tempFields["startDateYear"] = null;
    }

    if (item.endDate) {
      const endMoment = moment(item.endDate);
      this.tempFields["endDateMonth"] = parseInt(endMoment.format("M"));
      this.tempFields["endDateYear"] = parseInt(endMoment.format("YY"));
    } else {
      this.tempFields["endDateMonth"] = null;
      this.tempFields["endDateYear"] = null;
    }

    let setMoment = startOrEnd => {
      this.setField(
        this.fields,
        startOrEnd + "Date",
        moment(
          this.tempFields[startOrEnd + "DateMonth"] +
            " " +
            this.tempFields[startOrEnd + "DateYear"],
          "M YY"
        ).format()
      );
      //this.forceUpdate();
    };

    this.onChangeFuncs["isOngoing"] = () => {
      if (this.tempFields["isOngoing"]) {
        this.setField(this.fields, "endDate", null);
      } else {
        setMoment("end");
      }
    };

    this.onChangeFuncs["endDateMonth"] = setMoment.bind(this, "end");
    this.onChangeFuncs["endDateYear"] = setMoment.bind(this, "end");
    this.onChangeFuncs["startDateMonth"] = setMoment.bind(this, "start");
    this.onChangeFuncs["startDateYear"] = setMoment.bind(this, "start");
  }

  render() {
    const {
      contentName,
      headerName,
      index,
      intl,
      item,
      removeItemByIndex,
      subheaderName,
      onFieldChange,
      onTempFieldChange
    } = this.props;

    return (
      <HistoryItemFormView
        contentName={contentName}
        headerName={headerName}
        index={index}
        intl={intl}
        item={item}
        isOngoing={this.tempFields.isOngoing}
        endDateMonth={this.tempFields.endDateMonth}
        endDateYear={this.tempFields.endDateYear}
        startDateMonth={this.tempFields.startDateMonth}
        startDateYear={this.tempFields.startDateYear}
        disableEndDate={this.tempFields["isOngoing"]}
        removeItemByIndex={removeItemByIndex}
        subheaderName={subheaderName}
        onFieldChange={this.onFieldChange}
        onTempFieldChange={this.onTempFieldChange}
        {...this.props}
      />
    );
  }

  setField(fieldObj, name, value) {
    const { index, item, addItem, removeItem } = this.props;
    super.setField(fieldObj, name, value);
    if (fieldObj === this.fields) {
      removeItem(index);
      addItem(index, Object.assign(item, fieldObj));
    }
  }
}
