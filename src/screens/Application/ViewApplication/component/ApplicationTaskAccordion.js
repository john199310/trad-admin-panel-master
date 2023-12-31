import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Tooltip from 'rc-tooltip';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Button from '../../../../common/Button/Button';
import Checkbox from '../../../../common/Checkbox/Checkbox';
import {
  deleteApplicationTaskAction,
  getApplicationTaskDetail,
  getApplicationTaskEntityDropDownData,
  getApplicationTaskList,
  saveApplicationTaskData,
  updateApplicationTaskData,
  updateApplicationTaskStateFields,
} from '../../redux/ApplicationAction';
import TableApiService from '../../../../common/Table/TableApiService';
import Modal from '../../../../common/Modal/Modal';
import Input from '../../../../common/Input/Input';
import { errorNotification } from '../../../../common/Toast';
import { APPLICATION_REDUX_CONSTANTS } from '../../redux/ApplicationReduxConstants';
import DropdownMenu from '../../../../common/DropdownMenu/DropdownMenu';
import { SIDEBAR_NAMES } from '../../../../constants/SidebarConstants';
import { useModulePrivileges } from '../../../../hooks/userPrivileges/useModulePrivilegesHook';
import Select from '../../../../common/Select/Select';

const priorityData = [
  { value: 'low', label: 'Low', name: 'priority' },
  { value: 'high', label: 'High', name: 'priority' },
  { value: 'urgent', label: 'Urgent', name: 'priority' },
];

const entityTypeData = [
  { value: 'application', label: 'Application', name: 'entityType' },
  { value: 'client', label: 'Client', name: 'entityType' },
  { value: 'debtor', label: 'Debtor', name: 'entityType' },
  { value: 'insurer', label: 'Insurer', name: 'entityType' },
  // { value: 'claim', label: 'Claim', name: 'entityType' },
  // { value: 'overdue', label: 'Overdue', name: 'entityType' },
];

const ApplicationTaskAccordion = props => {
  const dispatch = useDispatch();
  const { applicationId, index } = props;
  const isTaskUpdatable =
    useModulePrivileges(SIDEBAR_NAMES.APPLICATION).hasWriteAccess &&
    useModulePrivileges('task').hasWriteAccess;
  const applicationTaskList = useSelector(
    ({ application }) => application?.viewApplication?.task?.taskList || []
  );

  const handleTaskCheckbox = useCallback(async (taskId, value) => {
    try {
      await TableApiService.tableActions({
        url: 'task',
        method: 'put',
        id: taskId,
        data: {
          isCompleted: value,
        },
      });
      dispatch(getApplicationTaskList(applicationId));
    } catch (e) {
      /**/
    }
  }, []);

  // edit task
  const [currentTaskId, setCurrentTaskId] = useState('');

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const onClickActionToggleButton = useCallback(
    (e, taskId) => {
      e.persist();
      e.stopPropagation();
      const menuTop = e.clientY + 10;
      const menuLeft = e.clientX - 90;
      setShowActionMenu(prev => !prev);
      setMenuPosition({ top: menuTop, left: menuLeft });
      setCurrentTaskId(taskId);
      //    const remainingBottomDistance = window.outerHeight - e.screenY;
      //    const remainingRightDistance = window.outerWidth - e.screenX;
    },
    [setShowActionMenu, setMenuPosition]
  );

  const [editTaskModal, setEditTaskModal] = useState(false);

  const toggleEditTaskModal = useCallback(
    value => setEditTaskModal(value !== undefined ? value : e => !e),
    [setEditTaskModal]
  );

  // Add New Task
  const loggedUserDetail = useSelector(({ loggedUserProfile }) => loggedUserProfile || []);
  const { entityType, ...addTaskState } = useSelector(
    ({ application }) => application?.viewApplication?.task?.addTask || {}
  );
  const taskDropDownData = useSelector(
    ({ application }) => application?.viewApplication?.dropDownData || {}
  );

  const {
    viewApplicationDeleteTaskButtonLoaderAction,
    viewApplicationAddNewTaskButtonLoaderAction,
    viewApplicationUpdateTaskButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { assigneeList, entityList } = useMemo(() => taskDropDownData, [taskDropDownData]);
  const { _id } = useMemo(() => loggedUserDetail, [loggedUserDetail]);

  const [addTaskModal, setAddTaskModal] = useState(false);

  const toggleAddTaskModal = useCallback(
    value => setAddTaskModal(value !== undefined ? value : e => !e),
    [setAddTaskModal]
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const backToTaskList = useCallback(() => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
        .APPLICATION_RESET_ADD_TASK_STATE_ACTION,
    });
    if (addTaskModal) toggleAddTaskModal();
    if (editTaskModal) toggleEditTaskModal();
    if (showConfirmModal) toggleConfirmationModal();

    dispatch(getApplicationTaskList(applicationId));
  }, [
    toggleAddTaskModal,
    toggleEditTaskModal,
    addTaskModal,
    editTaskModal,
    showConfirmModal,
    toggleConfirmationModal,
  ]);

  const onCloseTaskModal = useCallback(() => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
        .APPLICATION_RESET_ADD_TASK_STATE_ACTION,
    });
    if (addTaskModal) toggleAddTaskModal();
    if (editTaskModal) toggleEditTaskModal();
  }, [toggleAddTaskModal, addTaskModal, editTaskModal, toggleEditTaskModal]);

  const onAddTaskClick = useCallback(() => {
    dispatch(
      updateApplicationTaskStateFields(
        'assigneeId',
        assigneeList?.find(e => e.value === _id)
      )
    );
    dispatch(
      updateApplicationTaskStateFields(
        'entityId',
        entityList?.find(e => e.value === applicationId)
      )
    );
    dispatch(
      updateApplicationTaskStateFields(
        'entityType',
        entityTypeData?.find(e => e.value === 'application')
      )
    );
    toggleAddTaskModal();
  }, [assigneeList, _id, entityList, applicationId, toggleAddTaskModal]);

  const onEditTaskClick = useCallback(() => {
    setShowActionMenu(!showActionMenu);
    dispatch(getApplicationTaskDetail(currentTaskId));
    toggleEditTaskModal();
  }, [toggleEditTaskModal, setShowActionMenu, showActionMenu, currentTaskId]);

  const INPUTS = useMemo(
    () => [
      {
        label: 'Description',
        placeholder: 'Enter description',
        type: 'text',
        name: 'description',
        data: [],
      },
      {
        label: 'Assignee',
        placeholder: 'Select assignee',
        type: 'select',
        name: 'assigneeId',
        data: assigneeList,
      },
      {
        label: 'Priority',
        placeholder: 'Select priority',
        type: 'select',
        name: 'priority',
        data: priorityData,
      },
      {
        label: 'Due Date',
        placeholder: 'Select date',
        type: 'date',
        name: 'dueDate',
        data: [],
      },
      {
        label: 'Task For',
        placeholder: 'Select task for',
        type: 'select',
        name: 'entityType',
        data: entityTypeData,
      },
      {
        type: 'blank',
      },
      {
        label: 'Entity Labels',
        placeholder: 'Select entity',
        type: 'select',
        name: 'entityId',
        data: entityList,
      },
      {
        type: 'blank',
      },
      {
        label: 'Comments',
        placeholder: 'Enter comments',
        type: 'textarea',
        name: 'comments',
      },
    ],
    [assigneeList, entityList, priorityData, entityTypeData, addTaskState]
  );

  const updateAddTaskState = useCallback((name, value) => {
    dispatch(updateApplicationTaskStateFields(name, value));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateAddTaskState(name, value);
    },
    [updateAddTaskState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      updateAddTaskState(data?.name, data);
      if (data?.name === 'entityType') {
        updateAddTaskState('entityId', []);
        dispatch(getApplicationTaskEntityDropDownData({ entityName: data?.value }));
      }
    },
    [updateAddTaskState]
  );

  const handleDateChange = useCallback(
    (name, value) => {
      updateAddTaskState(name, value);
    },
    [updateAddTaskState]
  );

  const getSelectedValues = useCallback(
    fieldFor => {
      switch (fieldFor) {
        case 'description': {
          return addTaskState?.description || '';
        }
        case 'assigneeId': {
          return addTaskState?.assigneeId || [];
        }
        case 'priority': {
          return addTaskState?.priority || [];
        }
        case 'entityType': {
          return entityType || [];
        }
        case 'entityId': {
          return applicationTaskList?.selectedEntityDetails || addTaskState?.entityId || [];
        }
        case 'comments': {
          return addTaskState?.comments || '';
        }
        default:
          return [];
      }
    },
    [addTaskState, assigneeList, priorityData, entityList, entityTypeData, applicationTaskList]
  );

  const onSaveTaskClick = useCallback(async () => {
    const data = {
      description: addTaskState?.description?.trim() || '',
      dueDate: addTaskState?.dueDate || new Date().toISOString(),
      assigneeId: addTaskState?.assigneeId?.value,
      assigneeType: addTaskState?.assigneeId?.type ?? addTaskState?.assigneeType,
      taskFrom: 'application',
      priority: addTaskState?.priority?.value ?? undefined,
      entityType: entityType?.value ?? undefined,
      entityId: addTaskState?.entityId?.value ?? undefined,
      comments: addTaskState?.comments?.trim() ?? undefined,
    };

    if (!data.description && data.description.length === 0) {
      errorNotification('Please add description');
    } else {
      try {
        if (editTaskModal) {
          await dispatch(updateApplicationTaskData(currentTaskId, data, backToTaskList));
        } else {
          await dispatch(saveApplicationTaskData(data, backToTaskList));
        }
      } catch (e) {
        /**/
      }
    }
  }, [currentTaskId, addTaskState, backToTaskList, editTaskModal]);

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      const selectedValues = getSelectedValues(input.name);
      switch (input.type) {
        case 'text':
          component = (
            <>
              <span>{input.label}</span>
              <Input
                type="text"
                name={input.name}
                placeholder={input.placeholder}
                value={selectedValues}
                onChange={handleTextInputChange}
              />
            </>
          );
          break;

        case 'select': {
          component = (
            <>
              <span>{input.label}</span>
              <Select
                placeholder={input.placeholder}
                name={input.name}
                options={input.data}
                isSearchable
                value={selectedValues}
                onChange={handleSelectInputChange}
                isDisabled={['entityId', 'entityType'].includes(input.name)}
              />
            </>
          );
          break;
        }
        case 'date':
          component = (
            <>
              <span>{input.label}</span>
              <div className="date-picker-container">
                <DatePicker
                  placeholderText={input.placeholder}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  value={
                    addTaskState[input.name]
                      ? new Date(addTaskState[input.name]).toLocaleDateString()
                      : new Date().toLocaleDateString()
                  }
                  onChange={date => handleDateChange(input.name, new Date(date).toISOString())}
                  minDate={new Date()}
                  popperProps={{ positionFixed: true }}
                />
                <span className="material-icons-round">event</span>
              </div>
            </>
          );
          break;
        case 'blank': {
          component = (
            <>
              <div />
              <div />
            </>
          );
          break;
        }
        case 'textarea': {
          component = (
            <>
              <span>{input.label}</span>
              <textarea
                name={input.name}
                value={selectedValues}
                rows={4}
                className={input?.class}
                placeholder={input.placeholder}
                onChange={handleTextInputChange}
              />
            </>
          );
          break;
        }
        default:
          return null;
      }
      return <>{component}</>;
    },
    [INPUTS, addTaskState, entityList]
  );

  const addTaskModalButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseTaskModal },
      {
        title: 'Add',
        buttonType: 'primary',
        onClick: onSaveTaskClick,
        isLoading: viewApplicationAddNewTaskButtonLoaderAction,
      },
    ],
    [onSaveTaskClick, onCloseTaskModal, viewApplicationAddNewTaskButtonLoaderAction]
  );

  const editTaskModalButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseTaskModal },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onSaveTaskClick,
        isLoading: viewApplicationUpdateTaskButtonLoaderAction,
      },
    ],
    [onSaveTaskClick, onCloseTaskModal, viewApplicationUpdateTaskButtonLoaderAction]
  );

  const onDeleteTaskClick = useCallback(() => {
    setShowActionMenu(!showActionMenu);
    toggleConfirmationModal();
  }, [toggleConfirmationModal, setShowActionMenu, showActionMenu]);

  const deleteViewApplicationTask = useCallback(async () => {
    await dispatch(deleteApplicationTaskAction(currentTaskId, backToTaskList));
  }, [currentTaskId, backToTaskList]);

  const deleteTaskButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: deleteViewApplicationTask,
        isLoading: viewApplicationDeleteTaskButtonLoaderAction,
      },
    ],
    [
      toggleConfirmationModal,
      deleteViewApplicationTask,
      viewApplicationDeleteTaskButtonLoaderAction,
    ]
  );

  return (
    <>
      {applicationTaskList !== undefined && (
        <AccordionItem
          index={index}
          accordionBodyClass="application-active-accordion-scroll"
          header="Tasks"
          count={
            applicationTaskList?.docs?.length < 10
              ? `0${applicationTaskList?.docs?.length}`
              : applicationTaskList?.docs?.length
          }
          suffix="expand_more"
        >
          {isTaskUpdatable && (
            <Button
              buttonType="primary-1"
              title="Add Task"
              className="add-task-button"
              onClick={onAddTaskClick}
            />
          )}

          {applicationTaskList?.docs?.length > 0 ? (
            applicationTaskList.docs.map(task => (
              <div className="common-accordion-item-content-box" key={task._id}>
                <div className="document-title-row">
                  <Tooltip
                    overlayClassName="tooltip-left-class"
                    overlay={task.description || 'No task description set'}
                    placement="left"
                  >
                    <div className="document-title">{task.description || '-'}</div>
                  </Tooltip>

                  {isTaskUpdatable && (
                    <div className="d-flex">
                      <Checkbox
                        checked={task.isCompleted}
                        onClick={() => handleTaskCheckbox(task._id, !task.isCompleted)}
                      />
                      <span
                        className="material-icons-round font-placeholder cursor-pointer"
                        onClick={e => onClickActionToggleButton(e, task._id)}
                      >
                        more_vert
                      </span>
                    </div>
                  )}
                </div>
                <div className={`task-priority-${task.priority}`}>{task.priority}</div>
                <div className="date-owner-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">{moment(task.createdAt).format('DD-MMM-YYYY')}</span>

                  <span className="title">Owner:</span>
                  <Tooltip
                    overlayClassName="tooltip-left-class"
                    overlay={task.createdById || 'No owner name added'}
                    placement="left"
                  >
                    <span className="details">{task.createdById}</span>
                  </Tooltip>
                </div>
                <div className="font-field">Comments:</div>
                <div className="view-application-accordion-description">{task.comments || '-'}</div>
              </div>
            ))
          ) : (
            <div className="no-record-found">Nothing To Show</div>
          )}
        </AccordionItem>
      )}
      {addTaskModal && (
        <Modal
          header="Add Task"
          className="add-task-modal"
          buttons={addTaskModalButton}
          // hideModal={toggleAddTaskModal}
        >
          <div className="common-white-container my-work-add-task-container">
            {INPUTS.map(getComponentFromType)}
          </div>
        </Modal>
      )}
      {editTaskModal && (
        <Modal header="Edit Task" className="add-task-modal" buttons={editTaskModalButton}>
          <div className="common-white-container my-work-add-task-container">
            {INPUTS.map(getComponentFromType)}
          </div>
        </Modal>
      )}
      {showActionMenu && (
        <DropdownMenu
          style={menuPosition}
          toggleMenu={setShowActionMenu}
          menuClass="view-application-accordion-dropdown"
        >
          <div className="menu-name" onClick={onEditTaskClick}>
            <span className="material-icons-round">edit</span> Edit
          </div>
          <div className="menu-name" onClick={onDeleteTaskClick}>
            <span className="material-icons-round">delete_outline</span> Delete
          </div>
        </DropdownMenu>
      )}
      {showConfirmModal && (
        <Modal header="Delete Task" buttons={deleteTaskButtons} hideModal={toggleConfirmationModal}>
          <span className="confirmation-message">Are you sure you want to delete this Task?</span>
        </Modal>
      )}
    </>
  );
};

export default React.memo(ApplicationTaskAccordion);

ApplicationTaskAccordion.propTypes = {
  applicationId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
