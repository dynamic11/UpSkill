import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";

import NavigationBar from "../navigationBar/navigationBarController";
import {
  Card,
  Dimmer,
  Grid,
  Label,
  Loader,
  Table,
  Icon,
  List,
  Popup,
  Menu
} from "semantic-ui-react";

import EditWrapperController from "./editWrapper/editWrapperController";

import { renderValue } from "./common/profileTools";

import moment from "moment";

import tempProfilePic from "./../../assets/tempProfilePicture.png";

import EditLabelCardsController from "./editModals/editLabelCards/editLabelCardsController";
import EditPrimaryInformationController from "./editModals/editPrimaryInformation/editPrimaryInformationController";
import EditProfilePictureController from "./editModals/editProfilePicture/editProfilePictureController";

import ProfileCardController from "./profileCard/profileCardController";

//import "./primaryLayoutGroup.css";
//import "../common/common.css";

import EditLanguageProficiencyController from "./editModals/editLanguageProficiency/editLanguageProficiencyController";
import EditManagerController from "./editModals/editManager/editManagerController";
import EditTalentManagementController from "./editModals/editTalentManagement/editTalentManagementController";

import { EditableProvider } from "./editableProvider/editableProvider";

import EditCareerInterestsController from "./editModals/editCareerInterests/editCareerInterestsController";
import EditCareerOverviewController from "./editModals/editCareerOverview/editCareerOverviewController";
import EditCompetenciesController from "./editModals/editCompetencies/editCompetenciesController";
import EditDevelopmentalGoalsController from "./editModals/editDevelopmentalGoals/editDevelopmentalGoalsController";
import EditEducationController from "./editModals/editEducation/editEducationController";
import EditSkillController from "./editModals/editSkills/editSkillsController";
import EditProjectsController from "./editModals/editProjects/editProjectsController";

import HistoryCardController from "./historyCard/historyCardController";

import PrimaryLayoutGroupController from "./primaryLayoutGroup/primaryLayoutGroupController";
import SecondaryLayoutGroupController from "./secondaryLayoutGroup/secondaryLayoutGroupController";

import "./profileLayout.css";

class ProfileLayoutView extends Component {
  constructor(props) {
    super(props);

    const { intl } = this.props;

    this.alwaysUngroupedCards = [
      {
        isHiddenKey: "skills",
        renderFunction: this.renderSkillsCard
      },
      {
        isHiddenKey: "competencies",
        renderFunction: this.renderCompetenciesCard
      },
      {
        isHiddenKey: "developmentalGoals",
        renderFunction: this.renderDevelopmentalGoalsCard
      },
      {
        isHiddenKey: "education",
        renderFunction: this.renderEducationCard
      },
      {
        isHiddenKey: "careerOverview",
        renderFunction: this.renderCareerOverviewCard
      },
      {
        isHiddenKey: "projects",
        renderFunction: this.renderProjectsCard
      },
      {
        isHiddenKey: "careerInterests",
        renderFunction: this.renderCareerInterests
      }
    ];

    this.renderValue = renderValue.bind(this, intl);
  }

  render() {
    const {
      changeLanguage,
      editProfileOptions,
      editable,
      keycloak,
      profileInfo,
      windowWidth,
      visibleProfileCards
    } = this.props;

    if (profileInfo === undefined) {
      return (
        <Dimmer active>
          <Grid>
            <Grid.Row>
              <Loader />
            </Grid.Row>

            <Grid.Row>Gathering profile info...</Grid.Row>
          </Grid>
        </Dimmer>
      );
    }

    return (
      <EditableProvider value={{ editProfileOptions, editable, profileInfo }}>
        <NavigationBar
          changeLanguage={changeLanguage}
          keycloak={keycloak}
          logoRedirectHome={true}
        />

        <div className="body">
          {visibleProfileCards
            ? this.renderPublicProfileBody()
            : this.renderPrivateProfileBody()}
        </div>
      </EditableProvider>
    );
  }

  renderPublicProfileBody() {
    const { windowWidth, visibleProfileCards } = this.props;

    let ungroupedCardRows;
    let groupedCardRows;

    //Wide width - some cards up top need to be grouped
    if (windowWidth > 1250) {
      ungroupedCardRows = this.alwaysUngroupedCards;

      //generate primary group cards
      const infoVisible = visibleProfileCards["info"];
      const primaryGroupRow = (
        <Grid.Row>
          <Grid.Column width={infoVisible ? 11 : 16}>
            {this.renderPrimaryCard()}
          </Grid.Column>
          {infoVisible && (
            <Grid.Column width={5}> {this.renderInfoCard()} </Grid.Column>
          )}
        </Grid.Row>
      );

      //Generate secondary group of cards
      let secondaryGroupRow;
      const hasLeftCol =
        visibleProfileCards["manager"] ||
        visibleProfileCards["talentManagement"];
      const hasRightCol = visibleProfileCards["languageProficiency"];
      if (hasLeftCol && hasRightCol) {
        secondaryGroupRow = (
          <Grid.Row>
            <Grid.Column width={11}>
              {visibleProfileCards["manager"] && this.renderManagerCard()}
              {visibleProfileCards["talentManagement"] &&
                this.renderTalentManagementCard()}
            </Grid.Column>
            <Grid.Column width={5}>
              {this.renderLanguageProficiencyCard()}
            </Grid.Column>
          </Grid.Row>
        );
      } else if (hasLeftCol) {
        secondaryGroupRow = (
          <Grid.Row>
            <Grid.Column width={16}>
              {visibleProfileCards["manager"] && this.renderManagerCard()}
              {visibleProfileCards["talentManagement"] &&
                this.renderTalentManagementCard()}
            </Grid.Column>
          </Grid.Row>
        );
      } else if (hasRightCol) {
        secondaryGroupRow = (
          <Grid.Column width={16}>
            {this.renderLanguageProficiencyCard()}
          </Grid.Column>
        );
      }

      groupedCardRows = [primaryGroupRow, secondaryGroupRow];

      //Narrow view - no cards are grouped
    } else {
      groupedCardRows = null;

      ungroupedCardRows = [
        { isHiddenKey: null, renderFunction: this.renderPrimaryCard },
        { isHiddenKey: "info", renderFunction: this.renderInfoCard },
        { isHiddenKey: "manager", renderFunction: this.renderManagerCard },
        {
          isHiddenKey: "languageProficiency",
          renderFunction: this.renderLanguageProficiencyCard
        },
        {
          isHiddenKey: "talentManagement",
          renderFunction: this.renderTalentManagementCard
        },
        ...this.alwaysUngroupedCards
      ];
    }

    return (
      <Grid className="bodyGrid">
        {groupedCardRows}
        {ungroupedCardRows
          .filter(
            ({ isHiddenKey }) =>
              !isHiddenKey || visibleProfileCards[isHiddenKey]
          )
          .map(({ renderFunction }) => (
            <Grid.Row>
              <Grid.Column>{renderFunction.bind(this)()}</Grid.Column>
            </Grid.Row>
          ))}
      </Grid>
    );
  }

  renderPrivateProfileBody() {
    const { windowWidth } = this.props;

    let ungroupedCardRows;
    let groupedCardRows;

    //Wide width - some cards up top need to be grouped
    if (windowWidth > 1250) {
      ungroupedCardRows = this.alwaysUngroupedCards;

      groupedCardRows = [
        <Grid.Row>
          <Grid.Column width={11}> {this.renderPrimaryCard()} </Grid.Column>
          <Grid.Column width={5}> {this.renderInfoCard()} </Grid.Column>
        </Grid.Row>,
        <Grid.Row className="noGapBelow">
          <Grid.Column className="noGapAbove noGapBelow" width={11}>
            {this.renderManagerCard()}
            {this.renderTalentManagementCard()}
          </Grid.Column>
          <Grid.Column className="noGapAbove noGapBelow" width={5}>
            {this.renderLanguageProficiencyCard()}
          </Grid.Column>
        </Grid.Row>
      ];

      //Narrow view - no cards are grouped
    } else {
      groupedCardRows = null;

      ungroupedCardRows = [
        { isHiddenKey: null, renderFunction: this.renderPrimaryCard },
        { isHiddenKey: "info", renderFunction: this.renderInfoCard },
        { isHiddenKey: "manager", renderFunction: this.renderManagerCard },
        {
          isHiddenKey: "languageProficiency",
          renderFunction: this.renderLanguageProficiencyCard
        },
        {
          isHiddenKey: "talentManagement",
          renderFunction: this.renderTalentManagementCard
        },
        ...this.alwaysUngroupedCards
      ];
    }

    return (
      <Grid className="bodyGrid">
        {groupedCardRows}
        {ungroupedCardRows.map(({ renderFunction }) => (
          <Grid.Row>
            <Grid.Column>{renderFunction.bind(this)()}</Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    );
  }

  renderPrimaryCard() {
    const {
      branch,
      email,
      firstName,
      githubUrl,
      jobTitle,
      lastName,
      linkedinUrl,
      location,
      cellphone,
      organizationList,
      team,
      telephone,
      twitterUrl
    } = this.props.profileInfo;

    return (
      <EditWrapperController
        id="primaryCard"
        button={EditPrimaryInformationController}
      >
        <Card className="profileCard compactCard" fluid>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <h1
                  style={{
                    display: "inline-flex",
                    marginBottom: "6px",
                    marginLeft: "25px",
                    marginTop: "0px"
                  }}
                >
                  {firstName} {lastName}
                </h1>
              </Grid.Row>
              <Grid.Row className="noGapBelow">
                <EditWrapperController
                  button={EditProfilePictureController}
                  wrapperType="compactWrapper"
                >
                  <img
                    alt="missing profile"
                    src={tempProfilePic}
                    style={{
                      maxHeight: "200px",
                      maxWidth: "250px",
                      paddingLeft: "50px",
                      width: "100%"
                    }}
                  />
                </EditWrapperController>
                <div
                  style={{
                    display: "inline",
                    float: "right",
                    minWidth: "450px",
                    overflow: "hidden",
                    paddingLeft: "50px"
                  }}
                >
                  <h3 style={{ marginBottom: "3px" }}>{jobTitle}</h3>

                  <Popup
                    on="hover"
                    wide="very"
                    trigger={
                      <h5 className="noGapAbove">
                        {branch} <Icon name="angle down" />
                      </h5>
                    }
                  >
                    <Popup.Content>
                      {this.renderOrganizationList(
                        team ? [...organizationList, team] : organizationList
                      )}
                    </Popup.Content>
                  </Popup>

                  <div className="phoneNumberArea">
                    <FormattedMessage id="profile.telephone" />:
                    {this.renderValue(telephone, "profile.undefined")}
                  </div>
                  <div className="phoneNumberArea">
                    <FormattedMessage id="profile.cellphone" />:
                    {this.renderValue(cellphone, "profile.undefined")}
                  </div>
                  <div>{email}</div>

                  <div>
                    {this.renderValue(
                      location.description,
                      "profile.undefined.location"
                    )}
                  </div>
                </div>
              </Grid.Row>
            </Grid>
          </Card.Content>

          <Menu
            color="blue"
            inverted
            widths={
              [linkedinUrl, githubUrl, twitterUrl].filter(word => word).length
            }
          >
            {linkedinUrl && (
              <Menu.Item href={linkedinUrl} target="_blank">
                <Icon name="linkedin" />
                <FormattedMessage id="profile.linkedin" />
              </Menu.Item>
            )}

            {githubUrl && (
              <Menu.Item href={githubUrl} target="_blank">
                <Icon name="github" />
                <FormattedMessage id="profile.github" />
              </Menu.Item>
            )}
            {twitterUrl && (
              <Menu.Item href={twitterUrl} target="_blank">
                <Icon name="linkify" />
                <FormattedMessage id="profile.twitter" />
              </Menu.Item>
            )}
          </Menu>
        </Card>
      </EditWrapperController>
    );
  }

  renderSkillsCard() {
    const { intl, profileInfo } = this.props;
    const currentSkills = profileInfo.skills;

    return this.renderGenericTagsCard(
      intl.formatMessage({ id: "profile.skills" }),
      currentSkills,
      EditSkillController
    );
  }

  renderCompetenciesCard() {
    const { intl, profileInfo } = this.props;
    const { competencies } = profileInfo;

    return this.renderGenericTagsCard(
      intl.formatMessage({ id: "profile.competencies" }),
      competencies,
      EditCompetenciesController
    );
  }

  renderDevelopmentalGoalsCard() {
    const { intl, profileInfo } = this.props;
    const { developmentalGoals } = profileInfo;

    return this.renderGenericTagsCard(
      intl.formatMessage({ id: "profile.developmental.goals" }),
      developmentalGoals,
      EditDevelopmentalGoalsController
    );
  }

  renderGenericTagsCard(cardName, cardTags, button) {
    return (
      <ProfileCardController button={button} cardName={cardName}>
        {cardTags.map((value, index) => (
          <Label color="blue" basic>
            <p style={{ color: "black" }}>{value.text}</p>
          </Label>
        ))}
      </ProfileCardController>
    );
  }

  renderEducationCard() {
    const { intl, profileInfo } = this.props;
    const { education } = profileInfo;

    return (
      <HistoryCardController
        button={EditEducationController}
        cardEntries={education}
        cardName={intl.formatMessage({ id: "profile.education" })}
      />
    );
  }

  renderCareerOverviewCard() {
    const { intl, profileInfo } = this.props;
    const { careerSummary } = profileInfo;

    return (
      <HistoryCardController
        button={EditCareerOverviewController}
        cardEntries={careerSummary}
        cardName={intl.formatMessage({ id: "profile.career.overview" })}
      />
    );
  }

  renderProjectsCard() {
    const { intl, profileInfo } = this.props;
    const currentProjects = profileInfo.projects || [];

    return this.renderGenericTagsCard(
      intl.formatMessage({ id: "profile.projects" }),
      currentProjects,
      EditProjectsController
    );
  }

  renderCareerInterests() {
    const { intl, profileInfo } = this.props;

    const {
      interestedInRemote,
      relocationLocations,
      lookingForNewJob
    } = profileInfo;

    return (
      <ProfileCardController
        button={EditCareerInterestsController}
        cardName={"Career Interests"}
      >
        <div>
          <span className="boldLabel">
            <FormattedMessage id="profile.interested.in.remote" />
          </span>
          <span>
            {this.renderValue(
              {
                [null]: null,
                [true]: intl.formatMessage({ id: "profile.yes" }),
                [false]: intl.formatMessage({ id: "profile.no" })
              }[interestedInRemote]
            )}
          </span>
        </div>
        <div className="boldLabel">
          <FormattedMessage id="profile.willing.to.relocate.to" />
        </div>
        <div>
          {relocationLocations
            ? relocationLocations.map(element => (
                <Label color="blue" basic>
                  <p style={{ color: "black" }}>{element.description}</p>
                </Label>
              ))
            : null}
        </div>
        <span className="boldLabel">
          <FormattedMessage id="profile.looking.for.new.job" />
        </span>
        <span>
          {this.renderValue(lookingForNewJob && lookingForNewJob.description)}
        </span>
      </ProfileCardController>
    );
  }

  renderManagerCard() {
    const { profileInfo, windowWidth } = this.props;
    const { manager } = profileInfo;

    return (
      <ProfileCardController
        button={EditManagerController}
        className={
          windowWidth > 1250 ? "belowGapCard noGapAbove" : "noGapAbove"
        }
      >
        <span className="colorLabel">
          <FormattedMessage id="profile.manager" />:
        </span>
        <span>{this.renderValue(manager)}</span>
      </ProfileCardController>
    );
  }

  renderLanguageProficiencyCard() {
    const { intl, profileInfo, windowWidth } = this.props;
    const {
      firstLanguage,
      secondaryOralDate,
      secondaryOralProficiency,
      secondaryReadingDate,
      secondaryReadingProficiency,
      secondaryWritingDate,
      secondaryWritingProficiency
    } = profileInfo;

    return (
      <ProfileCardController
        button={EditLanguageProficiencyController}
        cardName={intl.formatMessage({ id: "profile.official.language" })}
        className={windowWidth > 1250 ? "compactCard" : null}
        fullHeight={windowWidth > 1250}
      >
        <div>
          <span className="boldLabel">
            <FormattedMessage id="profile.first.language" />
          </span>
          <span>{this.renderValue(firstLanguage)}</span>
        </div>
        <p className="boldLabel noGapBelow">
          <FormattedMessage id="profile.second.language.proficiency" />
        </p>
        <Table
          basic="very"
          celled
          className="noGapAbove"
          collapsing
          style={{ margin: "0px auto" }}
          unstackable
        >
          <Table.Body id="proficiencyTableBody">
            <Table.Row>
              <Table.Cell>
                <FormattedMessage
                  className={secondaryReadingProficiency ? "greyedOut" : null}
                  id="profile.reading"
                />
              </Table.Cell>
              <Table.Cell>{secondaryReadingProficiency}</Table.Cell>
              <Table.Cell>
                {moment(secondaryReadingDate).isValid()
                  ? moment(secondaryReadingDate).format("ll")
                  : null}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <FormattedMessage
                  className={secondaryWritingProficiency ? "greyedOut" : null}
                  id="profile.writing"
                />
              </Table.Cell>
              <Table.Cell>{secondaryWritingProficiency}</Table.Cell>
              <Table.Cell>
                {moment(secondaryWritingDate).isValid()
                  ? moment(secondaryWritingDate).format("ll")
                  : null}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <FormattedMessage
                  className={secondaryOralProficiency ? "greyedOut" : null}
                  id="profile.oral"
                />
              </Table.Cell>
              <Table.Cell>{secondaryOralProficiency}</Table.Cell>
              <Table.Cell>
                {moment(secondaryOralDate).isValid()
                  ? moment(secondaryOralDate).format("ll")
                  : null}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </ProfileCardController>
    );
  }

  renderTalentManagementCard() {
    const { intl, profileInfo } = this.props;
    const { careerMobility, talentMatrixResult, exFeeder } = profileInfo;

    return (
      <ProfileCardController
        button={EditTalentManagementController}
        cardName={intl.formatMessage({ id: "profile.talent.manager" })}
        cardIcon={
          <a href="http://icintra.ic.gc.ca/eforms/forms/ISED-ISDE3730E.pdf">
            <Icon name="external alternate" />
          </a>
        }
        className="noGapBelow"
      >
        <div>
          <span className="boldLabel">
            <FormattedMessage id="profile.career.mobility" />
          </span>
          <span>{this.renderValue(careerMobility.description)}</span>
        </div>
        <div>
          <span className="boldLabel">
            <FormattedMessage id="profile.talent.matrix.result" />
          </span>
          <span>{this.renderValue(talentMatrixResult.description)}</span>
        </div>
        {exFeeder && intl.formatMessage({ id: "profile.is.ex.feeder" })}
      </ProfileCardController>
    );
  }

  renderInfoCard() {
    const { intl, profileInfo, windowWidth } = this.props;
    const {
      acting,
      actingPeriodEndDate,
      actingPeriodStartDate,
      classification,
      indeterminate,
      security,
      temporaryRole,
      yearsOfService
    } = profileInfo;

    const actingDisabled = !(acting && actingPeriodStartDate);

    const actingLabel = intl.formatMessage({ id: "profile.acting" });
    const actingPeriodLabel = intl.formatMessage({
      id: "profile.acting.period"
    });
    const classificationLabel = intl.formatMessage({
      id: "profile.classification"
    });
    const substantiveLabel = intl.formatMessage({ id: "profile.substantive" });
    const securityLabel = intl.formatMessage({ id: "profile.security" });
    const temporaryRoleLabel = intl.formatMessage({
      id: "profile.temporary.role"
    });
    const startDateString = moment(actingPeriodStartDate).format("DD/MM/YYYY");
    const endDateString =
      actingPeriodEndDate !== "Undefined"
        ? moment(actingPeriodEndDate).format("DD/MM/YYYY")
        : intl.formatMessage({ id: "profile.ongoing" });

    const actingDateText = actingDisabled ? (
      <span className="greyedOut">
        {intl.formatMessage({ id: "profile.na" })}
      </span>
    ) : (
      startDateString + " - " + endDateString
    );

    // When using the medium wideness view there are 2 columns of labeled cards
    if (windowWidth <= 1250 && windowWidth > 750) {
      return (
        <ProfileCardController
          button={EditLabelCardsController}
          cardName="Info"
          className="labeledItemCard compactCard"
        >
          <Grid>
            <Grid.Column width={8}>
              <Grid>
                {this.renderLabeledItem(
                  substantiveLabel,
                  this.renderValue(
                    {
                      [true]: intl.formatMessage({
                        id: "profile.indeterminate"
                      }),
                      [false]: intl.formatMessage({ id: "profile.term" }),
                      [null]: null
                    }[indeterminate]
                  )
                )}
                {this.renderLabeledItem(
                  classificationLabel,
                  this.renderValue(
                    classification.description,
                    "profile.undefined"
                  )
                )}
                {this.renderLabeledItem(
                  temporaryRoleLabel,
                  this.renderValue(
                    temporaryRole.description,
                    "profile.undefined"
                  )
                )}
              </Grid>
            </Grid.Column>
            <Grid.Column width={8}>
              <Grid>
                {this.renderLabeledItem(
                  securityLabel,
                  this.renderValue(security.description, "profile.undefined")
                )}
                {this.renderLabeledItem(
                  actingLabel,
                  this.renderValue(
                    acting.description,
                    "profile.na",
                    actingDisabled
                  )
                )}
                {acting.description ? (
                  <div style={{ width: "100%", textAlign: "center" }}>
                    {actingDateText}
                  </div>
                ) : null}
              </Grid>
            </Grid.Column>
          </Grid>
        </ProfileCardController>
      );
    }
    //When using the most wide or most skinny view there is only one column of labeled cards

    return (
      <ProfileCardController
        button={EditLabelCardsController}
        cardName="Info"
        className="labeledItemCard compactCard"
        fullHeight={true}
      >
        <Grid columns={2} style={{ paddingTop: "16px" }}>
          {/*this.renderLabeledItem(
            SubstantiveLabel,
            this.renderValue(indeterminate.description, "profile.undefined")
          )*/}
          {this.renderLabeledItem(
            substantiveLabel,
            this.renderValue(
              {
                [true]: intl.formatMessage({ id: "profile.indeterminate" }),
                [false]: intl.formatMessage({ id: "profile.term" }),
                [null]: null
              }[indeterminate]
            )
          )}
          {this.renderLabeledItem(
            classificationLabel,
            this.renderValue(classification.description, "profile.undefined")
          )}
          {this.renderLabeledItem(
            temporaryRoleLabel,
            this.renderValue(temporaryRole.description, "profile.undefined")
          )}
          {this.renderLabeledItem(
            actingLabel,
            this.renderValue(acting.description, "profile.na", actingDisabled)
          )}
          {acting.description ? (
            <div style={{ width: "100%", textAlign: "center" }}>
              {actingDateText}
            </div>
          ) : null}
          {this.renderLabeledItem(
            securityLabel,
            this.renderValue(security.description, "profile.undefined")
          )}
        </Grid>
      </ProfileCardController>
    );
  }

  renderLabeledItem(labelText, contentText, disabled) {
    const { intl } = this.props;
    return (
      <Grid.Row columns={2} style={{ padding: "3px 0px" }}>
        <Grid.Column
          style={{ textAlign: "center", padding: "3px 0px 3px 3px" }}
        >
          <Label
            className={disabled ? "disabled" : null}
            fluid
            style={{ fontSize: "12pt", fontWeight: "normal", width: "90%" }}
          >
            {labelText}
          </Label>
        </Grid.Column>
        <Grid.Column style={{ padding: "0px" }}>
          {disabled ? intl.formatMessage({ id: "profile.na" }) : contentText}
        </Grid.Column>
      </Grid.Row>
    );
  }

  renderOrganizationList(unlistedItems, generatedElement) {
    if (unlistedItems.length === 0) {
      return <List className="organizationList"> {generatedElement} </List>;
    }

    const nextItem = unlistedItems[0];

    generatedElement = (
      <List.Item>
        {unlistedItems.length > 1 ? (
          <List.Icon
            color="grey"
            flipped="horizontally"
            name="level up alternate"
          />
        ) : null}
        <List.Content>
          <List.Description>{nextItem}</List.Description>
          <List.List>{generatedElement}</List.List>
        </List.Content>
      </List.Item>
    );

    return this.renderOrganizationList(
      unlistedItems.slice(1, unlistedItems.length),
      generatedElement
    );
  }
}

export default injectIntl(ProfileLayoutView);
