import { useEffect, useState } from 'react';
import { Divider, Form, Input, InputNumber, Select, Button } from 'antd';
import cn from 'classnames';

import { isNull } from '../../helpers';
import { FinishesType, MaterialsType, OtherPropsType, ProcessType } from '../../types';

import parameters from '../../mock/features.json';

import styles from './styles.module.scss';

const { Option } = Select;

export function MainForm() {
  const { processes, materials, finishes } = parameters;

  const [activeProcessId, setProcessId] = useState<number>(0);
  const [activeMaterial, setActiveMaterial] = useState<MaterialsType | null>(null);
  const [activeFinish, setActiveFinish] = useState<FinishesType | null>(null);

  const defaultOtherProps: OtherPropsType = {
    quantity: 1,
    customMaterial: null,
    customFinish: null,
    color: null,
    infill: null,
    tolerance: null,
    threads: 1,
    inserts: 1,
  };

  const availableOptions = checkAvailableOptions();

  const [otherProps, setOtherProps] = useState<OtherPropsType>(defaultOtherProps);

  useEffect(() => {
    setOtherProps({
      ...otherProps,
      tolerance: activeMaterial?.tolerance?.default || null,
    });
  }, [activeMaterial]);

  function handleSetProcess(id: number) {
    setProcessId(id);
    setActiveMaterial(null);
    setActiveFinish(null);
    setOtherProps(defaultOtherProps);
  }

  function handleSetMaterial(index: number) {
    setActiveMaterial({ ...materials[index], index });
    setActiveFinish(null);
    setOtherProps(defaultOtherProps);
  }

  function handleSetFinish(index: number) {
    setActiveFinish({ ...finishes[index], index });
  }

  function handleSetOtherProps(value: OtherPropsType) {
    setOtherProps({ ...otherProps, ...value });
  }

  function handleSubmit() {
    const { quantity, color, infill, customMaterial, customFinish, tolerance, threads, inserts } =
      otherProps;
    console.log({
      quantity,
      processId: activeProcessId,
      materialId: activeMaterial?.id,
      finishId: activeFinish?.id,
      customMaterial,
      customFinish,
      color,
      infill,
      tolerance,
      threads,
      inserts,
    });
  }

  function checkAvailableOptions() {
    return materials.filter((material: MaterialsType) => {
      return activeProcessId === material.processId && material.active;
    }).length;
  }

  function checkFinishesOptions() {
    return finishes.some((finish: FinishesType) => {
      return (
        activeProcessId === finish.processId &&
        finish.restrictedMaterials.find((element) => element === activeMaterial?.id)
      );
    });
  }

  return (
    <Form className={styles.FormContainer} layout="vertical">
      <div className={styles.FormHeader}>
        <span className={styles.FormHeader_Title}>Manufacturing Process / Material</span>
        <Form.Item className={styles.Quantity}>
          <span className={styles.FormHeader_Title}>Quantity:</span>
          <InputNumber
            min={1}
            size={'large'}
            className={styles.Quantity_Input}
            controls={true}
            value={otherProps.quantity}
            onChange={(element: number) => handleSetOtherProps({ quantity: element })}
          />
        </Form.Item>
      </div>
      <Form.Item className={styles.FormItem_lg}>
        <div className={styles.FormLabelContainer}>
          <span className={cn(styles.FormLabel, styles.FormLabel__primary)}>Technology:</span>
        </div>
        <Select size={'large'} onChange={handleSetProcess}>
          {processes.map((process: ProcessType) => {
            return (
              process.active && (
                <Option key={process.id} value={process.id}>
                  {process.name}
                </Option>
              )
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item className={styles.FormItem__lg}>
        <div className={styles.FormLabelContainer}>
          <span className={cn(styles.FormLabel, styles.FormLabel__primary)}>Material:</span>
          {!!availableOptions && (
            <span
              className={cn(styles.FormLabel, styles.FormLabel__second)}
            >{`${availableOptions} options available`}</span>
          )}
        </div>
        <Select size={'large'} onChange={handleSetMaterial} value={activeMaterial?.index}>
          {activeProcessId &&
            materials.map((material: MaterialsType, index) => {
              return (
                activeProcessId === material.processId &&
                material.active && (
                  <Option key={material.id} value={index}>
                    {material.name}
                  </Option>
                )
              );
            })}
        </Select>
      </Form.Item>
      {activeMaterial?.isCustom && (
        <Form.Item className={styles.FormItem__md} label="Custom material:">
          <Input
            size={'large'}
            value={isNull(otherProps.customMaterial) ? undefined : otherProps.customMaterial!}
            placeholder="Enter material"
            onChange={(event) => {
              handleSetOtherProps({
                customMaterial: event.target.value,
              });
            }}
          />
        </Form.Item>
      )}

      {!!activeMaterial?.color?.length && (
        <Form.Item className={styles.FormItem__md}>
          <div className={styles.FormLabelContainer}>
            <span
              className={cn(
                styles.FormLabel,
                styles.FormLabel__primary,
                styles.FormLabel__required
              )}
            >
              Color:
            </span>
          </div>
          <Select
            size={'large'}
            value={otherProps.color}
            onChange={(element) => handleSetOtherProps({ color: element })}
          >
            {activeMaterial?.color?.map((element) => {
              return (
                <Option key={element} value={element}>
                  {element}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      )}
      {!!activeMaterial?.infill?.length && (
        <Form.Item className={styles.FormItem__md}>
          <div className={styles.FormLabelContainer}>
            <span
              className={cn(
                styles.FormLabel,
                styles.FormLabel__primary,
                styles.FormLabel__required
              )}
            >
              Infill:
            </span>
          </div>
          <Select
            size={'large'}
            value={otherProps.infill}
            onChange={(element) => handleSetOtherProps({ infill: element })}
          >
            {activeMaterial?.infill?.map((element) => {
              return (
                <Option key={element} value={element}>
                  {element}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      )}

      <Divider className={styles.Divider} />
      <div className={styles.FormHeader}>
        <span className={styles.FormHeader_Title}>Advanced Features</span>
      </div>

      {checkFinishesOptions() && (
        <Form.Item className={styles.FormItem__md} label="Finish:">
          <Select size={'large'} value={activeFinish?.index} onChange={handleSetFinish}>
            {finishes.map((finish: FinishesType, index) => {
              return (
                activeProcessId === finish.processId &&
                finish.restrictedMaterials.find((element) => element === activeMaterial?.id) && (
                  <Option key={finish.id} value={index}>
                    {finish.name}
                  </Option>
                )
              );
            })}
          </Select>
        </Form.Item>
      )}
      {activeFinish?.isCustom && (
        <Form.Item className={styles.FormItem__md} label="Custom finish:">
          <Input
            size={'large'}
            value={otherProps.customFinish === null ? undefined : otherProps.customFinish!}
            placeholder="Enter"
            onChange={(event) => {
              handleSetOtherProps({
                customFinish: event.target.value,
              });
            }}
          />
        </Form.Item>
      )}

      {!!activeMaterial?.tolerance?.options?.length && (
        <Form.Item className={styles.FormItem__md} label="Tightest tolerance:">
          <Select
            size={'large'}
            value={
              isNull(otherProps.tolerance)
                ? activeMaterial?.tolerance?.default
                : otherProps.tolerance
            }
            onChange={(element) => handleSetOtherProps({ tolerance: element })}
          >
            {activeMaterial?.tolerance?.options?.map((element) => {
              return (
                <Option key={element} value={element}>
                  {element}
                </Option>
              );
            })}
          </Select>
          <span className={styles.FormItem_subDescription}>
            Not sure about the
            <a href="https://www.google.com/" target={'_blank'} rel="noreferrer">
              &nbsp;tolerance standards?
            </a>
          </span>
        </Form.Item>
      )}
      <Form.Item className={styles.FormItem__sm} label="Threads and Tapped Holes">
        <InputNumber
          min={1}
          size={'large'}
          className={styles.InputNumber}
          value={isNull(otherProps.threads) ? undefined : otherProps.threads}
          onChange={(number: number) => {
            handleSetOtherProps({ threads: number });
          }}
        />
      </Form.Item>
      <Form.Item className={styles.FormItem__sm} label="Inserts">
        <InputNumber
          min={1}
          size={'large'}
          className={styles.InputNumber}
          value={isNull(otherProps.inserts) ? undefined : otherProps.inserts}
          onChange={(number: number) => {
            handleSetOtherProps({ inserts: number });
          }}
        />
      </Form.Item>
      <Form.Item className={styles.FormItem_button}>
        <Button type="primary" className={styles.Button} onClick={handleSubmit}>
          Save Properties
        </Button>
      </Form.Item>
    </Form>
  );
}
